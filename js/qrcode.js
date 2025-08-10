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
    try { body = JSON.parse(text); } catch (e) { body = text; }

    if (!res.ok) {
      const msg = (body && body.msg) || res.statusText || "Erro na requisição";
      const err = new Error(msg);
      err.status = res.status;
      err.body = body;
      throw err;
    }
    if (body && typeof body === "object" && body.code && body.code === 403) {
      const err = new Error(body.msg || "permission error");
      err.status = 403;
      err.body = body;
      throw err;
    }
    return body;
  }

  let data = null;

  try {
    data = await safeFetch(`https://conexao-alimentar.onrender.com/qr-code/url/${idDoacao}`, { method: "GET" });

    const imageUrl = data.url;
    const segundosRestantes = data.segundosRestantes ?? (data.segundosTotais ? data.segundosTotais : 0);
    const totalOriginal = data.segundosTotais ?? 7200;

    qrContainer.innerHTML = `<img src="${imageUrl}" alt="QR Code" class="h-64 mx-auto">`;

    iniciarContagemRegressiva(segundosRestantes, totalOriginal);
  } catch (err) {
    console.error("Erro ao carregar QR:", err);
    if (err.status === 403) {
      qrContainer.innerHTML = `<p class="text-red-600">Permissão negada. Faça login com conta ONG.</p>`;
    } else {
      qrContainer.innerHTML = `<p class="text-red-600">${err.message}</p>`;
    }
    return;
  }

  function iniciarContagemRegressiva(segundosRestantes, totalOriginal) {
    let segundos = Number(segundosRestantes);
    const idReserva = data.reservaId;
    const statusAtual = data.statusReserva;

    if (statusAtual === "RETIRADA") {
      redirecionarParaAvaliacao(idReserva);
      return;
    }

    const intervaloStatus = setInterval(async () => {
      try {
        const novaData = await safeFetch(`https://conexao-alimentar.onrender.com/qr-code/url/${idDoacao}`, { method: "GET" });
        console.log("Status atual:", novaData.statusReserva);
        if (novaData.statusReserva === "RETIRADA") {
          clearInterval(intervaloStatus);
          redirecionarParaAvaliacao(novaData.reservaId);
        } else {
          if (typeof novaData.segundosRestantes === "number") {
            segundos = novaData.segundosRestantes;
            totalOriginal = novaData.segundosTotais ?? totalOriginal;
          }
        }
      } catch (e) {
        console.error("Erro ao verificar status da reserva:", e);
        if (e.status === 403) {
          clearInterval(intervaloStatus);
          qrContainer.innerHTML = `<p class="text-red-600">Permissão negada. Faça login novamente.</p>`;
        }
      }
    }, 5000);

    const intervalo = setInterval(() => {
      if (segundos <= 0) {
        clearInterval(intervalo);
        tempoExpiracao.textContent = "expirado";
        qrContainer.innerHTML = `<p class="text-red-600 font-semibold">QR Code expirado.</p>`;
        if (progressBar) progressBar.style.width = "0%";
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

  function redirecionarParaAvaliacao(reservaId) {
    alert("A doação foi retirada! Você será direcionado para avaliar o doador.");
    window.location.href = `../avaliacao/avaliacao.html?idReserva=${reservaId}`;
  }
});
