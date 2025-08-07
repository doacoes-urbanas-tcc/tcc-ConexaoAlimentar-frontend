document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa estar logado.");
    window.location.href = "/pages/cadastrologin/login.html";
    return;
  }

  try {
    const respEstatisticas = await fetch("https://conexao-alimentar.onrender.com/voluntario/dashboard-ti", {
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
        <p class="text-sm text-gray-600 mt-2">${resposta.resposta}</p>
        <p class="text-xs text-gray-400 mt-1">Respondida em: ${new Date(resposta.dataResposta).toLocaleDateString()}</p>
      `;

      container.appendChild(card);
    });
  } catch (e) {
    console.error("Erro ao carregar dashboard:", e);
    alert("Erro ao carregar dashboard do voluntário.");
  }
});
