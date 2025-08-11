document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const nomeUsuario = localStorage.getItem("nome") || "Doador";

    if (!token) {
    window.location.href = "/pages/cadastrologin/login.html";
    return;
    }


  fetch("https://conexao-alimentar.onrender.com/doacoes/metricas", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao buscar métricas do dashboard");
      return res.json();
    })
    .then(data => {
      document.getElementById("nome").textContent = data.nome;
      document.getElementById("totalDoacoes").textContent = data.totalDoacoes;
      document.getElementById("ongsBeneficiadas").textContent = data.ongsBeneficiadas;
      document.getElementById("mediaAvaliacoes").textContent = `${(data.mediaAvaliacoes || 0).toFixed(1)} ★`;

  
      const ultimaDoacaoElements = ["dataUltimaDoacao", "itensUltimaDoacao", "destinoUltimaDoacao", "statusUltimaDoacao"];
      ultimaDoacaoElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
      });
    })
    .catch(error => {
      console.error(error);
      showError("Erro ao carregar dados do dashboard.");
    });
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

