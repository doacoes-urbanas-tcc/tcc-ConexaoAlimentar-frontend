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

  const idDoacao = reserva.doacaoId ?? reserva.idDoacao ?? reserva.doacao?.id;

  card.innerHTML = `
    <div class="flex flex-col h-full bg-white rounded-lg shadow p-4">
      <img src="${reserva.urlImagem || ''}" alt="${reserva.nomeAlimento || 'Imagem'}" 
          class="w-full h-40 object-contain rounded-md mb-3">

      <div class="flex flex-col flex-grow justify-between">
        <div>
          <h3 class="text-lg font-semibold text-red-600 mb-1">${reserva.nomeAlimento || 'Item'}</h3>
          <p class="text-gray-700 text-sm mb-3">${reserva.descricao || "Sem descrição."}</p>
          
          <div class="text-sm text-gray-600 space-y-1">
            <p><strong>Categoria:</strong> ${reserva.categoria || "-"}</p>
            <p><strong>Quantidade:</strong> ${reserva.quantidade ?? '-'} ${unidade}</p>
            <p><strong>Validade:</strong> ${validadeFormatada}</p>
            <p><strong>Doador:</strong> ${reserva.doadorNome || "-"}</p>
            <p><strong>Status:</strong> ${status}</p>
            <p><strong>Expira em:</strong> ${expiraEmExibicao}</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mt-4">
          ${podeVerQRCode && idDoacao
            ? `<a data-acao="ver-qrcode" 
                 href="/pages/reserva/qrcode.html?id=${idDoacao}" 
                 class="flex-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition text-sm text-center">
                 Ver QR Code
               </a>`
            : `<span class="flex-1 text-xs text-red-500 font-medium text-center">QR Code expirado</span>`
          }
          <a href="/pages/administrador/perfil-usuario.html?id=${reserva.doadorId}&tipo=${reserva.doadorTipo}" 
             class="flex-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition text-sm text-center">
            Ver Perfil
          </a>
        </div>
      </div>
    </div>
  `;

  lista.appendChild(card);

  const linkQr = card.querySelector('a[data-acao="ver-qrcode"]');
  if (linkQr && idDoacao) {
    linkQr.addEventListener('click', () => {
      localStorage.setItem("dadosDoacao", JSON.stringify({
        id: idDoacao,
        nomeAlimento: reserva.nomeAlimento,
        doadorNome: reserva.doadorNome,
        endereco: reserva.endereco,
        quantidade: reserva.quantidade,
        unidadeMedida: reserva.unidadeMedida,
        categoria: reserva.categoria,
        dataValidade: reserva.dataValidade,
        contato: reserva.contato,
        descricao: reserva.descricao,
        lat: reserva.latitude ?? reserva.lat,
        lng: reserva.longitude ?? reserva.lng,
        urlImagem: reserva.urlImagem
      }));
    });
  }
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
  const msgEl = document.getElementById('mensagem-erro');
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




