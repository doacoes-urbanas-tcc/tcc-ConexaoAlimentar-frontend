
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
    } catch (e) {
      body = text;
    }

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

  function mostrarQRCodeExpirado() {
    tempoExpiracao.textContent = "expirado";
    qrContainer.innerHTML = `<p class="text-red-600 font-semibold">QR Code expirado.</p>`;
    if (progressBar) progressBar.style.width = "0%";
  }

  function redirecionarParaAvaliacao(reservaId) {
    alert("A doação foi retirada! Você será direcionado para avaliar o doador.");
    window.location.href = `../avaliacao/avaliacao.html?idReserva=${reservaId}`;
  }

  let intervaloStatus = null;
  let intervaloCountdown = null;

  function iniciarContagemRegressiva(segundosRestantes, totalOriginal) {
    let segundos = Number(segundosRestantes);

    if (intervaloStatus) clearInterval(intervaloStatus);
    if (intervaloCountdown) clearInterval(intervaloCountdown);

    if (data.statusReserva === "RETIRADA") {
      redirecionarParaAvaliacao(data.reservaId);
      return;
    }

    if (segundos <= 0) {
      tempoExpiracao.textContent = "Verificando validade...";
      setTimeout(async () => {
        try {
          const novaData = await safeFetch(`https://conexao-alimentar.onrender.com/qr-code/url/${idDoacao}`, { method: "GET" });
          if (novaData.segundosRestantes > 0) {
            iniciarContagemRegressiva(novaData.segundosRestantes, novaData.segundosTotais);
          } else {
            mostrarQRCodeExpirado();
          }
        } catch {
          mostrarQRCodeExpirado();
        }
      }, 3000);
      return;
    }

    intervaloStatus = setInterval(async () => {
      try {
        const novaData = await safeFetch(`https://conexao-alimentar.onrender.com/qr-code/url/${idDoacao}`, { method: "GET" });
        console.log("Status atual:", novaData.statusReserva);

        if (novaData.statusReserva === "RETIRADA") {
          clearInterval(intervaloStatus);
          clearInterval(intervaloCountdown);
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
          clearInterval(intervaloCountdown);
          localStorage.removeItem("token");
          qrContainer.innerHTML = `<p class="text-red-600">Permissão negada. Faça login novamente.</p>`;
          setTimeout(() => {
            window.location.href = "/pages/cadastrologin/login.html";
          }, 3000);
        }
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
    data = await safeFetch(`https://conexao-alimentar.onrender.com/qr-code/url/${idDoacao}`, { method: "GET" });

    if (!data.url) {
      qrContainer.innerHTML = `<p class="text-red-600">QR Code não encontrado.</p>`;
      return;
    }

    qrContainer.innerHTML = `<img src="${data.url}" alt="QR Code" class="h-64 mx-auto">`;

    iniciarContagemRegressiva(data.segundosRestantes ?? 0, data.segundosTotais ?? 7200);
  } catch (err) {
    console.error("Erro ao carregar QR:", err);
    if (err.status === 403) {
      localStorage.removeItem("token");
      qrContainer.innerHTML = `<p class="text-red-600">Permissão negada. Faça login com conta ONG.</p>`;
      setTimeout(() => {
        window.location.href = "/pages/cadastrologin/login.html";
      }, 3000);
    } else {
      qrContainer.innerHTML = `<p class="text-red-600">${err.message}</p>`;
    }
  }
});
