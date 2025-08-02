 const token = localStorage.getItem("token");

    async function fetchTasks() {
        const response = await fetch("http://localhost:8080/tasks-ti/admin", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const tasks = await response.json();
      const container = document.getElementById("lista-tasks");
      container.innerHTML = "";

      for (const task of tasks) {
        const respostasResp = await fetch(`http://localhost:8080/tasks-ti/admin/${task.id}/respostas`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const respostas = await respostasResp.json();

        const card = document.createElement("div");
        card.className = "bg-white p-6 rounded shadow";

        card.innerHTML = `
          <h3 class="text-xl font-semibold mb-2">${task.titulo}</h3>
          <p class="text-gray-700 mb-4">${task.descricao}</p>
          <h4 class="font-bold mb-2">Respostas:</h4>
          <ul class="space-y-2">
            ${respostas.map(r => `
              <li class="border p-3 rounded">
                <p><strong>Voluntário:</strong> ${r.nomeVoluntario}</p>
                <p><strong>Link:</strong> <a href="${r.linkSolucao}" class="text-blue-600 underline" target="_blank">${r.linkSolucao}</a></p>
                <p><strong>Status:</strong> ${r.status}</p>
              </li>
            `).join('')}
          </ul>
        `;

        container.appendChild(card);
      }
    }

    fetchTasks();

    function logout() {
      localStorage.removeItem("token");
      window.location.href = "/pages/cadastrologin/login.html";
    }