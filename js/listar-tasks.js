const token = localStorage.getItem("token");

    async function fetchTasks() {
      const res = await fetch("http://localhost:8080/tasks-ti/admin", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const tasks = await res.json();
      const container = document.getElementById("lista-tasks");
      container.innerHTML = "";

      if (tasks.length === 0) {
        container.innerHTML = "<p class='text-gray-600'>Nenhuma task cadastrada.</p>";
        return;
      }

      tasks.forEach(task => {
        const card = document.createElement("div");
        card.className = "bg-white shadow-md rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-4";

        card.innerHTML = `
          <div class="flex-1">
            <h2 class="text-xl font-semibold text-gray-800 mb-1">${task.titulo}</h2>
            <p class="text-gray-700 text-sm mb-2">${task.descricao.length > 120 ? task.descricao.slice(0, 120) + '...' : task.descricao}</p>
            <div class="flex flex-wrap gap-2 mt-2">
              ${task.tags.map(tag => `
                <span class="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">${tag}</span>
              `).join('')}
            </div>
          </div>
          <button onclick="verRespostas(${task.id})" class="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded text-sm self-end md:self-auto">
            Ver Respostas
          </button>
        `;

        container.appendChild(card);
      });
    }

    function verRespostas(taskId) {
      window.location.href = `/pages/administrador/respostas-task.html?id=${taskId}`;
    }

    function logout() {
      localStorage.removeItem("token");
      window.location.href = "/pages/cadastrologin/login.html";
    }

    fetchTasks();