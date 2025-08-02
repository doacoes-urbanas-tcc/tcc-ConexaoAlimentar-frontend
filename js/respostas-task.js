const token = localStorage.getItem("token");

    async function fetchTasks() {
      const res = await fetch("http://localhost:8080/tasks-ti/admin", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const tasks = await res.json();
      const container = document.getElementById("lista-tasks");
      container.innerHTML = "";

      for (const task of tasks) {
        const resResp = await fetch(`http://localhost:8080/tasks-ti/admin/${task.id}/respostas`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const respostas = await resResp.json();

        const card = document.createElement("div");
        card.className = "bg-white p-6 rounded shadow";

        card.innerHTML = `
          <h2 class="text-xl font-semibold mb-2">${task.titulo}</h2>
          <p class="text-gray-700 mb-4">${task.descricao}</p>
          <div class="space-y-4">
            ${respostas.map(r => `
              <div class="border rounded p-4 bg-gray-50">
                <p><strong>Voluntário:</strong> ${r.nomeVoluntario}</p>
                <p><strong>Link:</strong> <a href="${r.linkSolucao}" target="_blank" class="text-blue-600 underline">${r.linkSolucao}</a></p>
                <p><strong>Status:</strong> <span id="status-${r.id}" class="font-semibold">${r.status}</span></p>
                <div class="mt-2 space-x-2">
                  <button onclick="alterarStatus(${r.id}, 'ACEITA')" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">Aceitar</button>
                  <button onclick="alterarStatus(${r.id}, 'RECUSADA')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Recusar</button>
                </div>
              </div>
            `).join('')}
          </div>
        `;

        container.appendChild(card);
      }
    }

    async function alterarStatus(respostaId, status) {
      const confirmed = confirm(`Tem certeza que deseja marcar como ${status}?`);
      if (!confirmed) return;

      await fetch(`http://localhost:8080/tasks-ti/admin/respostas/${respostaId}/status?status=${status}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });

      document.getElementById(`status-${respostaId}`).textContent = status;
    }

    function logout() {
      localStorage.removeItem("token");
      window.location.href = "/pages/cadastrologin/login.html";
    }

    fetchTasks();