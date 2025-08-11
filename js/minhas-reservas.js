document.addEventListener("DOMContentLoaded", async () => {
  const lista = document.getElementById("lista-reservas");
  const token = localStorage.getItem("token");

  if (!token) {
    showError("Você precisa estar logado.", () =>{
    window.location.href = "/pages/cadastrologin/login.html";
    return;
    });
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

  function parseDateTimeToMs(value) {
    if (!value) return null;
    if (typeof value === "number") return value;
    const tryDate = new Date(value);
    if (!isNaN(tryDate.getTime())) return tryDate.getTime();
    const tryZ = new Date(value + "Z");
    if (!isNaN(tryZ.getTime())) return tryZ.getTime();
    const tryT = new Date(value.replace(" ", "T"));
    if (!isNaN(tryT.getTime())) return tryT.getTime();
    const parsed = Date.parse(value);
    if (!isNaN(parsed)) return parsed;
    console.warn("Falha ao parsear dataExpiracao:", value);
    return null;
  }

  function formatarData(data) {
    if (!data) return "";
    return new Date(data).toLocaleDateString("pt-BR");
  }

  function formatarDataHora(dataHora) {
    if (!dataHora) return "";
    const d = new Date(dataHora);
    const opcoes = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Sao_Paulo",
    };
    return d.toLocaleString("pt-BR", opcoes);
  }

  try {
    const reservas = await safeFetch("https://conexao-alimentar.onrender.com/reservas/minhas-reservas", { method: "GET" });

    if (!Array.isArray(reservas) || reservas.length === 0) {
      lista.innerHTML = `<p class="text-gray-600">Você ainda não possui reservas.</p>`;
      return;
    }

    lista.innerHTML = "";

    reservas.forEach(reserva => {
      console.log("Reserva recebida:", reserva);

      const card = document.createElement("div");
      card.className = "bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-4";

      const status = (reserva.status || "").replace(/_/g, " ");
      const dataExpiracaoMs = reserva.dataExpiracao
        ? parseDateTimeToMs(reserva.dataExpiracao)
        : (reserva.dataReserva && reserva.segundosTotais ? (parseDateTimeToMs(reserva.dataReserva) + (reserva.segundosTotais * 1000)) : null);

      const agoraMs = Date.now();

      const podeVerPeloBackend = typeof reserva.qrCodeAtivo === "boolean" ? reserva.qrCodeAtivo : null;

      const podeVerQRCode = (podeVerPeloBackend !== null)
        ? (reserva.status === "RESERVADA" && podeVerPeloBackend)
        : (reserva.status === "RESERVADA" && dataExpiracaoMs !== null && agoraMs < dataExpiracaoMs);

      const validadeFormatada = reserva.dataValidade ? formatarData(reserva.dataValidade) : "Não disponível";
      const expiraEmExibicao = dataExpiracaoMs ? formatarDataHora(dataExpiracaoMs) : "Não disponível";
      const unidade = reserva.unidadeMedida ? reserva.unidadeMedida.toLowerCase() : "";

      card.innerHTML = `
        <img src="${reserva.urlImagem || ''}" alt="${reserva.nomeAlimento || 'Imagem'}" class="w-full md:w-48 h-48 object-cover rounded-lg">
        <div class="flex-1">
          <h3 class="text-xl font-semibold text-red-600">${reserva.nomeAlimento || 'Item'}</h3>
          <p class="text-gray-700 mb-2">${reserva.descricao || "Sem descrição."}</p>
          <div class="text-sm text-gray-600 space-y-1 mb-3">
            <p><strong>Categoria:</strong> ${reserva.categoria || "-"}</p>
            <p><strong>Quantidade:</strong> ${reserva.quantidade ?? '-'} ${unidade}</p>
            <p><strong>Validade:</strong> ${validadeFormatada}</p>
            <p><strong>Doador:</strong> ${reserva.doadorNome || "-"}</p>
            <p><strong>Status:</strong> ${status}</p>
            <p><strong>Expira em:</strong> ${expiraEmExibicao}</p>
          </div>
          <div class="flex flex-wrap gap-2 mt-2">
            ${podeVerQRCode 
              ? `<a href="/pages/reserva/qrcode.html?id=${reserva.id}" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Ver QR Code</a>`
              : `<span class="text-sm text-red-600 font-semibold">QR Code expirado</span>`
            }
            <a href="/pages/administrador/perfil-usuario.html?id=${reserva.doadorId}&tipo=${reserva.doadorTipo}" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
              Ver Perfil do doador
            </a>
          </div>
        </div>
      `;

      lista.appendChild(card);
    });

  } catch (err) {
    console.error("Erro ao buscar reservas:", err);
    if (err.status === 403) {
      lista.innerHTML = `<p class="text-red-600">Permissão negada. Faça login com uma conta ONG.</p>`;

    } else {
      lista.innerHTML = `<p class="text-red-600">Erro ao carregar suas reservas.</p>`;
    }
  }
});

function showSuccess(message, onOk = null) {
  const modal = document.getElementById('modalSuccess');
  const msgEl = document.getElementById('mensagem-sucesso');
  msgEl.textContent = message;
  modal.classList.remove('hidden');

  function closeHandler() {
    modal.classList.add('hidden');
    if (onOk) onOk();
    removeListeners();
  }

  function removeListeners() {
    okBtn.removeEventListener('click', closeHandler);
    closeBtn.removeEventListener('click', closeHandler);
  }

  const okBtn = modal.querySelector('button.bg-green-500');
  const closeBtn = modal.querySelector('button.absolute');

  okBtn.addEventListener('click', closeHandler);
  closeBtn.addEventListener('click', closeHandler);
}

function showError(message, onOk = null) {
  const modal = document.getElementById('modalError');
  const msgEl = document.getElementById('modalErrorMessage');
  msgEl.textContent = message;
  modal.classList.remove('hidden');

  function closeHandler() {
    modal.classList.add('hidden');
    if (onOk) onOk();
    removeListeners();
  }

  function removeListeners() {
    okBtn.removeEventListener('click', closeHandler);
    closeBtn.removeEventListener('click', closeHandler);
  }

  const okBtn = modal.querySelector('button.bg-red-500');
  const closeBtn = modal.querySelector('button.absolute');

  okBtn.addEventListener('click', closeHandler);
  closeBtn.addEventListener('click', closeHandler);
}




