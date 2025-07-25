document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const token = localStorage.getItem("token");

  const qrContainer = document.getElementById("qr-container");
  const tempoExpiracao = document.getElementById("tempo-expiracao");
  const progressBar = document.getElementById("progress-bar");

  try {
    const response = await fetch(`http://localhost:8080/qr-code/url/${id}`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!response.ok) throw new Error("QR Code não encontrado.");

    const imageUrl = await response.text();

    qrContainer.innerHTML = `<img src="${imageUrl}" alt="QR Code" class="h-64 mx-auto">`;

    iniciarContagemRegressiva(7200); 
  } catch (err) {
    qrContainer.innerHTML = `<p class="text-red-600">${err.message}</p>`;
  }

  function iniciarContagemRegressiva(segundos) {
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
});