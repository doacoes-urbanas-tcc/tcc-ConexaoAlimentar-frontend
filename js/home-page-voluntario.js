document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("usuarioId");

  if (!token || !usuarioId) {
    showToast("Você precisa estar logado.", "error");
    window.location.href = "/pages/cadastrologin/login.html";
    return;
  }

  try {
    const respEstatisticas = await fetch(`https://conexao-alimentar.onrender.com/voluntario/dashboard-ti/${usuarioId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!respEstatisticas.ok) throw new Error("Falha ao buscar estatísticas.");

    const data = await respEstatisticas.json();

    document.getElementById("nomeUsuario").textContent = data.nome;
    document.getElementById("tasksRespondidas").textContent = data.tasksRespondidas;
    document.getElementById("tasksAbertas").textContent = data.tasksAbertas;
    document.getElementById("mediaAvaliacoes").textContent = `${data.mediaAvaliacoes.toFixed(1)} ★`;

    const container = document.getElementById("cardsContainer");
    container.innerHTML = "";

    if (!data.respostas || data.respostas.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center text-gray-600">
          Nenhuma resposta enviada ainda.
        </div>
      `;
      return;
    }

    data.respostas.forEach((resposta) => {
      const card = document.createElement("div");
      card.className = "bg-white p-4 shadow rounded-lg";

      card.innerHTML = `
        <h3 class="text-lg font-bold text-red-600">${resposta.tituloTask}</h3>
        <p class="text-sm text-gray-600 mt-2">
          <a href="${resposta.linkSolucao}" target="_blank" class="text-blue-500 underline">Ver solução</a>
        </p>
        <p class="text-xs text-gray-400 mt-1">Respondida em: ${new Date(resposta.dataResposta).toLocaleDateString()}</p>
      `;

      container.appendChild(card);
    });
  } catch (e) {
    console.error("Erro ao carregar dashboard:", e);
    showToast("Erro ao carregar dashboard do voluntário.", "error");
  }
});


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
