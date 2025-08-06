document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  try {
    const respEstatisticas = await fetch("https://conexao-alimentar.onrender.com/voluntario/dashboard", {
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

    carregarMinhasRespostas(token);
  } catch (e) {
    console.error(e);
    alert("Erro ao carregar dashboard do voluntário.");
  }
});

async function carregarMinhasRespostas(token) {
  try {
    const resp = await fetch("https://conexao-alimentar.onrender.com/voluntario/minhas-respostas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!resp.ok) throw new Error("Erro ao buscar respostas.");

    const respostas = await resp.json();
    const container = document.getElementById("cardsContainer");
    container.innerHTML = "";

    respostas.forEach(resposta => {
      const card = document.createElement("div");
      card.className = "bg-white p-4 shadow rounded-lg";

      card.innerHTML = `
        <h3 class="text-lg font-bold text-red-600">${resposta.tituloTask}</h3>
        <p class="text-sm text-gray-600 mt-2">${resposta.resposta}</p>
        <p class="text-xs text-gray-400 mt-1">Respondida em: ${new Date(resposta.dataResposta).toLocaleDateString()}</p>
      `;
      container.appendChild(card);
    });
  } catch (e) {
    console.error(e);
  }
}
