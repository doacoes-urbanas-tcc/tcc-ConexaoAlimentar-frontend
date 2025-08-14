const token = localStorage.getItem("token");
const params = new URLSearchParams(window.location.search);
const taskId = params.get("id");

async function fetchDados() {
  try {
    const taskRes = await fetch(`https://conexao-alimentar.onrender.com/tasks-ti/admin/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const task = await taskRes.json();
    document.getElementById("titulo").textContent = task.titulo;
    document.getElementById("descricao").textContent = task.descricao;

    const resResp = await fetch(`https://conexao-alimentar.onrender.com/tasks-ti/admin/${taskId}/respostas`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const respostas = await resResp.json();

    const container = document.getElementById("lista-respostas");
    container.innerHTML = respostas.length === 0
      ? '<p class="text-gray-600">Nenhuma resposta recebida ainda.</p>'
      : "";

    respostas.forEach(r => {
      const card = document.createElement("div");
      card.className = "bg-white shadow rounded-lg p-6 flex justify-between items-start flex-col md:flex-row gap-4";

      card.innerHTML = `
        <div class="flex-1">
          <p class="text-sm text-gray-600 mb-1"><strong class="text-gray-800">Voluntário:</strong> ${r.nomeVoluntario}</p>
          <p class="text-sm text-gray-600 mb-1"><strong class="text-gray-800">Link:</strong> 
            <a href="${r.linkSolucao}" class="text-blue-600 underline" target="_blank">${r.linkSolucao}</a>
          </p>
          <p class="text-sm text-gray-600"><strong class="text-gray-800">Status:</strong> 
            <span id="status-${r.id}" class="font-semibold">${r.status}</span>
          </p>
        </div>
        <div class="flex flex-col items-end justify-center gap-2">
          <button onclick="verPerfil(${r.voluntarioId})"
            class="text-xs px-4 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition">
            Ver perfil
          </button>
          <button onclick="alterarStatus(${r.id}, 'ACEITA')"
            class="text-xs px-4 py-1 rounded-md bg-green-500 text-white hover:bg-green-600 transition">
            Aceitar
          </button>
          <button onclick="alterarStatus(${r.id}, 'RECUSADA')"
            class="text-xs px-4 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition">
            Recusar
          </button>
        </div>
      `;
      container.appendChild(card);
    });

  } catch (err) {
    showErrorToast("Erro ao carregar dados da task.");
  }
}

async function alterarStatus(respostaId, status) {
  showConfirmToast(`Tem certeza que deseja marcar como ${status}?`, async () => {
    try {
      const resp = await fetch(`https://conexao-alimentar.onrender.com/tasks-ti/admin/respostas/${respostaId}/status?status=${status}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (resp.ok) {
        document.getElementById(`status-${respostaId}`).textContent = status;
        showSuccessToast(`Status alterado para ${status}.`);
      } else {
        showErrorToast("Erro ao alterar status.");
      }
    } catch {
      showErrorToast("Erro na solicitação ao alterar status.");
    }
  });
}

async function fecharTask() {
  showConfirmToast("Tem certeza que deseja fechar esta task?", async () => {
    try {
      const resp = await fetch(`https://conexao-alimentar.onrender.com/tasks-ti/admin/${taskId}/fechar`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (resp.ok) {
        showSuccessToast("Task fechada com sucesso!", () => {
          window.location.href = "/pages/administrador/listar-tasks.html";
        });
      } else {
        showErrorToast("Erro ao fechar a task.");
      }
    } catch {
      showErrorToast("Erro na solicitação para fechar task.");
    }
  });
}

function verPerfil(id) {
  window.location.href = `../administrador/perfil-usuario.html?id=${id}&tipo=VOLUNTARIO`;
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/pages/cadastrologin/login.html";
}

document.getElementById("fecharBtn").addEventListener("click", fecharTask);

fetchDados();
