document.getElementById("form-alterar-senha").addEventListener("submit", async (e) => {
  e.preventDefault();

  const senhaAtual = document.getElementById("senhaAtual").value;
  const novaSenha = document.getElementById("novaSenha").value;
  const confirmar = document.getElementById("confirmarNovaSenha").value;

  if (novaSenha !== confirmar) {
    showError("As senhas não coincidem.");
    return;
  }

  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("usuarioId");
  const tipoUsuario = localStorage.getItem("tipoUsuario")?.toLowerCase();

  if (!tipoUsuario || !usuarioId || !token) {
    showError("Erro de autenticação. Faça login novamente.");
    return;
  }

  try {
    const response = await fetch(`https://conexao-alimentar.onrender.com/${tipoUsuario}/${usuarioId}/senha`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ senhaAtual, novaSenha }),
    });

    if (response.ok) {
      showSuccess("Senha atualizada com sucesso!", () => {
        window.location.href = "/pages/cadastrologin/login.html";
      });
    } else {
      const msg = await response.text();
      showError(msg || "Erro ao atualizar senha.");
    }
  } catch (err) {
    showError("Erro na solicitação.");
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

