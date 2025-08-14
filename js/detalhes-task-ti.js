document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const taskId = urlParams.get("id");
  const token = localStorage.getItem("token");
  const voluntarioId = localStorage.getItem("usuarioId");

  if (!taskId || !token) {
    showToast("ID da tarefa inválido ou usuário não autenticado.", "error");
    window.location.href = "voluntario-ti.html";
    return;
  }

  try {
    const res = await fetch(`https://conexao-alimentar.onrender.com/tasks-ti/voluntario/${taskId}`, {
      headers: { "Authorization": "Bearer " + token }
    });

    if (!res.ok) throw new Error("Erro ao buscar detalhes da tarefa.");
    const task = await res.json();

    const div = document.getElementById("detalhesTask");
    div.innerHTML = `
      <h1 class="text-2xl font-bold">${task.titulo}</h1>
      <p class="mt-2 text-gray-700">${task.descricao}</p>
      ${task.linkRepositorio ? `<p class="mt-2 text-sm">Repositório original: <a href="${task.linkRepositorio}" target="_blank" class="text-blue-600 underline">${task.linkRepositorio}</a></p>` : ""}
      <p class="text-sm text-gray-500 mt-2">Tags: ${task.tags.join(", ")}</p>
    `;
  } catch (err) {
    console.error(err);
    showToast("Erro ao carregar dados da tarefa.", "error");
  }

  document.getElementById("formResposta").addEventListener("submit", async (e) => {
    e.preventDefault();
    const linkSolucao = document.getElementById("linkSolucao").value.trim();

    if (!linkSolucao) {
      showToast("Por favor, insira o link da solução.", "error");
      return;
    }

    try {
      const res = await fetch(`https://conexao-alimentar.onrender.com/tasks-ti/voluntario/${taskId}/responder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ voluntarioId, linkSolucao })
      });

      if (!res.ok) throw new Error("Erro ao enviar resposta.");
      showToast("Resposta enviada com sucesso!", "success");
      setTimeout(() => window.location.href = "voluntario-ti.html", 2000);
    } catch (err) {
      console.error(err);
      showToast(err.message || "Erro ao enviar resposta.", "error");
    }
  });
});

/**
 * Exibe um toast de sucesso ou erro
 * @param {string} message - Texto da mensagem
 * @param {"success" | "error"} type - Tipo de toast
 */
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `max-w-xs w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 p-4 flex items-center justify-between transition transform duration-300 ${
    type === "success" ? "border-l-4 border-green-500" : "border-l-4 border-red-500"
  }`;

  toast.innerHTML = `
    <div class="flex-1">
      <p class="text-sm font-medium text-gray-900">${message}</p>
    </div>
    <button class="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none">&times;</button>
  `;

  container.appendChild(toast);

  const remove = () => {
    toast.classList.add("opacity-0", "translate-x-5");
    setTimeout(() => toast.remove(), 300);
  };

  toast.querySelector("button").addEventListener("click", remove);
  setTimeout(remove, 3000);
}
