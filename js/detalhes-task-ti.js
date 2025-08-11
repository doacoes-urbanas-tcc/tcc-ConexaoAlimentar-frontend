   const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get("id");
    const token = localStorage.getItem("token");
    const voluntarioId = localStorage.getItem("usuarioId");

    fetch(`https://conexao-alimentar.onrender.com/tasks-ti/voluntario/${taskId}`, {
      headers: { "Authorization": "Bearer " + token }
    })
    .then(res => res.json())
    .then(task => {
      const div = document.getElementById("detalhesTask");
      div.innerHTML = `
        <h1 class="text-2xl font-bold">${task.titulo}</h1>
        <p class="mt-2 text-gray-700">${task.descricao}</p>
        ${task.linkRepositorio ? `<p class="mt-2 text-sm">Repositório original: <a href="${task.linkRepositorio}" target="_blank" class="text-blue-600 underline">${task.linkRepositorio}</a></p>` : ""}
        <p class="text-sm text-gray-500 mt-2">Tags: ${task.tags.join(", ")}</p>
      `;
    });

    document.getElementById("formResposta").addEventListener("submit", (e) => {
      e.preventDefault();
      const linkSolucao = document.getElementById("linkSolucao").value;

      fetch(`https://conexao-alimentar.onrender.com/tasks-ti/voluntario/${taskId}/responder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          voluntarioId: voluntarioId,
          linkSolucao: linkSolucao
        })
      })
      .then(res => {
         if (!res.ok) throw new Error("Erro ao enviar resposta.");
         showSuccess("Resposta enviada com sucesso!", () => {
         window.location.href = "voluntario-ti.html";
        });
      })
      .catch(err => alert(err.message));
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



