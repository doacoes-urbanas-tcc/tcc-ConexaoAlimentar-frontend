document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const doacaoId = params.get("doacaoId");
  const token = localStorage.getItem("token");
  const qrContainer = document.getElementById("qr-container");
  const tempoExpiracao = document.getElementById("tempo-expiracao");
  const progressBar = document.getElementById("progress-bar");

  let data = null; 

  if (!token || !doacaoId) {
    qrContainer.innerHTML = `<p class="text-red-600">Acesso inválido.</p>`;
    return;
  }

  try {
    const response = await fetch(`https://conexao-alimentar.onrender.com/qr-code/url/${doacaoId}`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!response.ok) throw new Error("QR Code não encontrado.");

    data = await response.json(); 
    const imageUrl = data.url; 
    const segundosRestantes = data.segundosRestantes;

    qrContainer.innerHTML = `<img src="${imageUrl}" alt="QR Code" class="h-64 mx-auto">`;

    iniciarContagemRegressiva(segundosRestantes);
  } catch (err) {
    qrContainer.innerHTML = `<p class="text-red-600">${err.message}</p>`;
  }

  function iniciarContagemRegressiva(segundos) {
    const idReserva = data.reservaId;
    const statusAtual = data.statusReserva;
    console.log("Status inicial:", statusAtual);

    if (statusAtual === "RETIRADA") {
      console.log("Status RETIRADA no carregamento, redirecionando...");
      redirecionarParaAvaliacao(idReserva);
      
    } else {
      const intervaloStatus = setInterval(async () => {
        console.log("Checando status da reserva...");
        try {
          const responseStatus = await fetch(`https://conexao-alimentar.onrender.com/qr-code/url/${id}`, {
            method: "GET",
            headers: {
              "Authorization": "Bearer " + token
            }
          });

          if (responseStatus.ok) {
            const novaData = await responseStatus.json();
            console.log("Status atual:", novaData.statusReserva);
            if (novaData.statusReserva === "RETIRADA") {
              clearInterval(intervaloStatus);
               console.log("Status mudou para RETIRADA, redirecionando...");
              redirecionarParaAvaliacao(novaData.reservaId);
            }
          }
        } catch (e) {
          console.error("Erro ao verificar status da reserva:", e);
        }
      }, 5000); 
    }

    const total = segundos;

    const intervalo = setInterval(() => {
      if (segundos <= 0) {
        clearInterval(intervalo);
        tempoExpiracao.textContent = "expirado";
        qrContainer.innerHTML = `<p class="text-red-600 font-semibold">QR Code expirado.</p>`;
        progressBar.style.width = "0%";
        return;
      }

      const minutos = Math.floor(segundos / 60);
      const restoSegundos = segundos % 60;
      tempoExpiracao.textContent = `${minutos}m ${restoSegundos}s`;

      const porcentagem = (segundos / total) * 100;
      progressBar.style.width = `${porcentagem}%`;

      segundos--;
    }, 1000);
  }

  function redirecionarParaAvaliacao(reservaId) {
    alert("A doação foi retirada! Você será direcionado para avaliar o doador.");
    window.location.href = `../avaliacao/avaliacao.html?idReserva=${reservaId}`;
  }
});
