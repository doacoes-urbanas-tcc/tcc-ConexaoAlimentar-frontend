document.addEventListener("DOMContentLoaded", async () => {
  const lista = document.getElementById("lista-avaliacoes");
  const urlParams = new URLSearchParams(window.location.search);
  const avaliadoId = urlParams.get("id");
  const token = localStorage.getItem("token");

  if (!avaliadoId) {
    lista.innerHTML = "<p class='text-gray-700'>ID do usuário não especificado.</p>";
    return;
  }

  try {
    const resp = await fetch(`https://conexao-alimentar.onrender.com/avaliacoes/${avaliadoId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!resp.ok) throw new Error("Erro ao carregar avaliações");

    const avaliacoes = await resp.json();

    if (avaliacoes.length === 0) {
      lista.innerHTML = "<p class='text-gray-700'>Nenhuma avaliação encontrada.</p>";
      return;
    }

    lista.innerHTML = ""; 

    avaliacoes.forEach(avaliacao => {
      const item = document.createElement("div");
      item.className = "bg-white p-4 rounded shadow mb-4";

      const estrelas = "★".repeat(avaliacao.nota) + "☆".repeat(5 - avaliacao.nota);

      const data = new Date(avaliacao.dataCriacao);
      const dataFormatada = data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });

      item.innerHTML = `
        <div class="flex items-center gap-4 mb-4">
          <img src="${avaliacao.fotoAvaliador || '/assets/default-avatar.png'}" alt="Foto Avaliador" class="w-12 h-12 rounded-full object-cover border" />
          <div>
            <p class="font-semibold text-gray-800">${avaliacao.nomeAvaliador || 'Usuário'}</p>
            <p class="text-sm text-gray-500">${dataFormatada}</p>
          </div>
        </div>
        <div class="flex justify-between items-center mb-2">
          <div class="text-yellow-400 font-bold text-lg">${estrelas}</div>
        </div>
        <p class="text-gray-800">${avaliacao.comentario}</p>
      `;

      lista.appendChild(item);
    });
  } catch (err) {
    showError(`Erro: ${err.message}`);
  }
});

function showSuccess(message, onOk = null) {
  const modal = document.getElementById('modalSuccess');
  const msgEl = document.getElementById('modalSuccessMessage');
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


