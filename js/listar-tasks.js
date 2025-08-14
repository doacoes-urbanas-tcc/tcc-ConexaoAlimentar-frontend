"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/pages/cadastrologin/login.html";
    return;
  }

  fetchTasks(token);
});

async function fetchTasks(token) {
  const container = document.getElementById("lista-tasks");

  try {
    const res = await fetch("https://conexao-alimentar.onrender.com/tasks-ti/admin", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      container.innerHTML = `<p class="text-red-600">Erro ao carregar as tasks.</p>`;
      return;
    }

    const tasks = await res.json();
    container.innerHTML = "";

    if (!tasks || tasks.length === 0) {
      container.innerHTML = "<p class='text-gray-600'>Nenhuma task cadastrada.</p>";
      return;
    }

    tasks.forEach(task => {
      const card = document.createElement("div");
      card.className =
        "bg-white shadow-md rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-4";

      card.innerHTML = `
        <div class="flex-1">
          <h2 class="text-xl font-semibold text-gray-800 mb-1">${task.titulo}</h2>
          <p class="text-gray-700 text-sm mb-2">
            ${task.descricao.length > 120 ? task.descricao.slice(0, 120) + "..." : task.descricao}
          </p>
          <div class="flex flex-wrap gap-2 mt-2">
            ${(task.tags || [])
              .map(tag => `<span class="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">${tag}</span>`)
              .join("")}
          </div>
        </div>
        <button class="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded text-sm self-end md:self-auto ver-respostas-btn" 
          data-id="${task.id}">
          Ver Respostas
        </button>
      `;

      container.appendChild(card);
    });

    container.addEventListener("click", (event) => {
      const btn = event.target.closest(".ver-respostas-btn");
      if (btn) {
        verRespostas(btn.dataset.id);
      }
    });

  } catch (error) {
    console.error("Erro ao carregar tasks:", error);
    container.innerHTML = `<p class="text-red-600">Erro inesperado. Tente novamente mais tarde.</p>`;
  }
}

function verRespostas(taskId) {
  window.location.href = `/pages/administrador/respostas-task.html?id=${taskId}`;
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/pages/cadastrologin/login.html";
}
