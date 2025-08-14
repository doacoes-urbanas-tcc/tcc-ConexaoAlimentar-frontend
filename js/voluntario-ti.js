const token = localStorage.getItem("token");

fetch("https://conexao-alimentar.onrender.com/tasks-ti/voluntario", {
  headers: {
    "Authorization": "Bearer " + token
  }
})
  .then(res => {
    if (!res.ok) {
      return res.text().then(txt => { throw new Error(txt); });
    }
    return res.json();
  })
  .then(tasks => {
    const container = document.getElementById("listaTasks");

    if (!tasks || tasks.length === 0) {
      showToast("Nenhuma tarefa disponível no momento.", "info");
      return;
    }

    tasks.forEach(task => {
      const card = document.createElement("div");
      card.className = "bg-white p-4 rounded shadow";

      card.innerHTML = `
        <h2 class="text-xl font-semibold">${task.titulo}</h2>
        <p class="text-gray-700">${task.descricao}</p>
        <p class="text-sm mt-2 text-gray-500">Tecnologias: ${task.tags.join(", ")}</p>
        <button onclick="verDetalhes(${task.id})" class="mt-3 bg-blue-600 text-white px-4 py-2 rounded">Ver Detalhes</button>
      `;
      container.appendChild(card);
    });

    showToast("Tarefas carregadas com sucesso!", "success");
  })
  .catch(err => {
    showToast("Erro ao carregar tarefas: " + err.message, "error");
  });

function verDetalhes(id) {
  window.location.href = `detalhes-task-ti.html?id=${id}`;
}

function showToast(message, type = "info") {
  const toastContainer = document.getElementById("toast-container");
  if (!toastContainer) return;

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500"
  };

  const toast = document.createElement("div");
  toast.className = `${colors[type] || colors.info} text-white px-4 py-2 rounded shadow-md transition-opacity duration-300 opacity-100`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
