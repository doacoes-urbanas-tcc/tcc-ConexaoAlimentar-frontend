document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const info = document.getElementById("infoDoacao");
  const btn = document.getElementById("btnConfirmar");
  const token = localStorage.getItem("token");

  if (!id || !token) {
   showError("Requisição inválida.");
    window.location.href = "/pages/doacao/minhas-doacoes.html";
    return;
  }

  try {
    const response = await fetch(`https://conexao-alimentar.onrender.com/doacoes/${id}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!response.ok) throw new Error("Erro ao buscar doação.");

    const doacao = await response.json();
    info.textContent = `Tem certeza que deseja excluir a doação "${doacao.nomeAlimento}"?`;
  } catch (e) {
    info.textContent = "Erro ao carregar dados da doação.";
    console.error(e);
  }

  btn.addEventListener("click", async () => {
    const confirmado = confirm("Essa ação não poderá ser desfeita. Deseja continuar?");
    if (!confirmado) return;

    try {
      const deleteResp = await fetch(`https://conexao-alimentar.onrender.com/doacoes/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + token
        }
      });

      if (!deleteResp.ok) throw new Error("Erro ao excluir doação.");

      showSuccess("Doação excluída com sucesso.");
      window.location.href = "/pages/doacao/minhas-doacoes.html";
    } catch (e) {
      console.error(e);
      showError("Erro ao excluir doação.");
    }
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




