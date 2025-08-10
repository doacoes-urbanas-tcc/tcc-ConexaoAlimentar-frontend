document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("usuarioId");

  if (!token || !usuarioId) {
    window.location.href = "../cadastrologin/login.html";
    return;
  }

  fetch(`https://conexao-alimentar.onrender.com/ong/dashboard/${usuarioId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("totalDoacoesRecebidas").textContent = data.totalDoacoesRecebidas;
      document.getElementById("mediaAvaliacoes").textContent = data.mediaAvaliacoes.toFixed(1);
    })
    .catch(err => console.error("Erro ao carregar estatísticas:", err));
});
