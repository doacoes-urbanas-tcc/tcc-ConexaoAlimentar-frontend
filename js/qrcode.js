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
    try { body = JSON.parse(text); } catch { body = text; }
    if (!res.ok) throw new Error(body?.msg || res.statusText || "Erro na requisição");
    return body;
  }

  function mostrarQRCodeExpirado() {
    tempoExpiracao.textContent = "expirado";
    qrContainer.innerHTML = `<p class="text-red-600 font-semibold">QR Code expirado.</p>`;
    if (progressBar) progressBar.style.width = "0%";
  }

  function redirecionarParaAvaliacao(reservaId) {
    showToast("A doação foi retirada! Você será direcionado para avaliar o doador.", "success");
    setTimeout(() => {
      window.location.href = `../avaliacao/avaliacao.html?idReserva=${reservaId}`;
    }, 2500);
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
      } catch (e) { console.error(e); }
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
    showToast(err.message, "error");
    qrContainer.innerHTML = `<p class="text-red-600">${err.message}</p>`;
  }

const btnVerLocalizacao = document.getElementById("btnVerLocalizacao");
if (btnVerLocalizacao) {
  btnVerLocalizacao.addEventListener("click", async () => {
    try {
      const dataDoacao = await safeFetch(`https://conexao-alimentar.onrender.com/doacoes/${idDoacao}`);
      
      const doacao = {
        id: dataDoacao.id ?? dataDoacao.idDoacao, 
        nomeAlimento: dataDoacao.nomeAlimento,
        doadorNome: dataDoacao.doadorNome,
        quantidade: dataDoacao.quantidade,
        unidadeMedida: dataDoacao.unidadeMedida,
        categoria: dataDoacao.categoria,
        dataValidade: dataDoacao.dataValidade,
        descricao: dataDoacao.descricao,
        urlImagem: dataDoacao.urlImagem,
        lat: dataDoacao.latitude,
        lng: dataDoacao.longitude
      };

      localStorage.setItem("dadosDoacao", JSON.stringify(doacao));
      window.location.href = `/pages/geolocalizacao/geoloc.html?id=${idDoacao}`;

    } catch (error) {
      console.error("Erro ao buscar dados da doação:", error);
      showToast("Erro ao carregar localização da doação.", "error");
    }
  });
}


});

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return console.error("Toast container não encontrado.");

  const toast = document.createElement("div");
  toast.className = `p-4 rounded-lg shadow-md text-white flex items-center justify-between transition-all duration-500 ease-in-out ${
    type === "success" ? "bg-green-500" : "bg-red-500"
  }`;
  toast.innerHTML = `
    <span>${message}</span>
    <button class="ml-4 text-white hover:text-gray-200">&times;</button>
  `;

  const closeBtn = toast.querySelector("button");
  closeBtn.addEventListener("click", () => {
    toast.remove();
  });

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
