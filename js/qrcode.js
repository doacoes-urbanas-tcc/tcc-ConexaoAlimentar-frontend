document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const idDoacao = params.get("id");
  const token = localStorage.getItem("token");

  const qrContainer = document.getElementById("qr-container");
  const tempoExpiracao = document.getElementById("tempo-expiracao");
  const progressBar = document.getElementById("progress-bar");

  if (!token || !idDoacao) {
    qrContainer.innerHTML = `<p class="text-red-600">Acesso inválido.</p>`;
    return;
  }

  async function safeFetch(url, opts = {}) {
    opts.headers = opts.headers || {};
    if (token) opts.headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(url, opts);
    const text = await res.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
    if (!res.ok) throw new Error(body?.msg || res.statusText || "Erro na requisição");
    return body;
  }

  function mostrarQRCodeExpirado() {
    tempoExpiracao.textContent = "expirado";
    qrContainer.innerHTML = `<p class="text-red-600 font-semibold">QR Code expirado.</p>`;
    if (progressBar) progressBar.style.width = "0%";
  }

  function redirecionarParaAvaliacao(reservaId) {
    showSuccess("A doação foi retirada! Você será direcionado para avaliar o doador.", () => {
      window.location.href = `../avaliacao/avaliacao.html?idReserva=${reservaId}`;
    });
  }

  let intervaloStatus = null;
  let intervaloCountdown = null;

  function iniciarContagemRegressiva(segundosRestantes, totalOriginal) {
    let segundos = Number(segundosRestantes);

    if (data.statusReserva === "RETIRADA") {
      redirecionarParaAvaliacao(data.reservaId);
      return;
    }

    if (segundos <= 0) {
      mostrarQRCodeExpirado();
      return;
    }

    intervaloStatus = setInterval(async () => {
      try {
        const novaData = await safeFetch(`https://conexao-alimentar.onrender.com/qr-code/url/${idDoacao}`);
        if (novaData.statusReserva === "RETIRADA") {
          clearInterval(intervaloStatus);
          clearInterval(intervaloCountdown);
          redirecionarParaAvaliacao(novaData.reservaId);
        }
      } catch (e) {
        console.error(e);
      }
    }, 5000);

    intervaloCountdown = setInterval(() => {
      if (segundos <= 0) {
        clearInterval(intervaloCountdown);
        clearInterval(intervaloStatus);
        mostrarQRCodeExpirado();
        return;
      }
      const minutos = Math.floor(segundos / 60);
      const restoSegundos = segundos % 60;
      tempoExpiracao.textContent = `${minutos}m ${restoSegundos}s`;
      const porcentagem = (segundos / totalOriginal) * 100;
      if (progressBar) progressBar.style.width = `${porcentagem}%`;
      segundos--;
    }, 1000);
  }

  let data = null;
  try {
    data = await safeFetch(`https://conexao-alimentar.onrender.com/qr-code/url/${idDoacao}`);
    if (!data.url) {
      qrContainer.innerHTML = `<p class="text-red-600">QR Code não encontrado.</p>`;
      return;
    }
    qrContainer.innerHTML = `<img src="${data.url}" alt="QR Code" class="h-64 mx-auto">`;
    iniciarContagemRegressiva(data.segundosRestantes ?? 0, data.segundosTotais ?? 7200);
  } catch (err) {
    console.error(err);
    qrContainer.innerHTML = `<p class="text-red-600">${err.message}</p>`;
  }
   const btnVerLocalizacao = document.getElementById("btnVerLocalizacao");

if (btnVerLocalizacao) {
  btnVerLocalizacao.addEventListener("click", () => {
    const dados = {
      nomeAlimento: doacao.nomeAlimento,
      doadorNome: doacao.doadorNome,
      endereco: doacao.endereco,
      quantidade: doacao.quantidade,
      unidadeMedida: doacao.unidadeMedida,
      categoria: doacao.categoria,
      dataValidade: doacao.dataValidade,
      contato: doacao.contato,
      descricao: doacao.descricao,
      lat: doacao.lat,
      lng: doacao.lng,
      urlImagem: doacao.urlImagem
    };

    localStorage.setItem("dadosDoacao", JSON.stringify(dados));
    window.location.href = "/pages/reserva/geolocalizacao.html";
  });
}


});

