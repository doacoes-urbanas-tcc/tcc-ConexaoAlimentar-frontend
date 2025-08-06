document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("tasksContainer");
  const mensagem = document.getElementById("mensagem");
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("https://conexao-alimentar.onrender.com/tasks-ti/voluntario/recomendadas", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      mensagem.textContent = "Erro ao buscar tasks recomendadas.";
      return;
    }

    const tasks = await response.json();

    if (tasks.length === 0) {
      mensagem.textContent = "Nenhuma task recomendada encontrada com base na sua stack.";
      return;
    }

    tasks.forEach(task => {
      const card = document.createElement("div");
      card.className = "bg-white shadow p-4 rounded-md border border-red-200";

      card.innerHTML = `
        <h2 class="text-xl font-semibold text-red-600 mb-2">${task.titulo}</h2>
        <p class="text-gray-700 mb-2">${task.descricao}</p>
        <p class="text-sm text-gray-500">Tags: ${task.tags.join(", ")}</p>
        <button onclick="responder(${task.id})"
          class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Responder
        </button>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    mensagem.textContent = "Erro ao carregar tasks.";
  }
});

function responder(taskId) {
  window.location.href = `../voluntario/detalhes-task-ti.html?id=${taskId}`;
}
