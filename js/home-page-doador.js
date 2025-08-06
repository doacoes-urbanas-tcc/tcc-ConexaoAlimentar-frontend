document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("usuarioId");

  if (!token || !usuarioId) {
    window.location.href = "/login.html";
    return;
  }

  fetch(`https://conexao-alimentar.onrender.com/usuario/doador/dashboard/${usuarioId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao buscar dashboard");
      return res.json();
    })
    .then(data => {
      document.getElementById("nome").textContent = localStorage.getItem("nomeUsuario") || "Doador";
      document.getElementById("totalDoacoes").textContent = data.totalDoacoes;
      document.getElementById("ongsBeneficiadas").textContent = data.ongsBeneficiadas;
      document.getElementById("mediaAvaliacoes").textContent = `${(data.mediaAvaliacoes || 0).toFixed(1)} ★`;

      if (data.ultimaDoacao) {
        document.getElementById("dataUltimaDoacao").textContent = "Data: " + data.ultimaDoacao.data;
        document.getElementById("itensUltimaDoacao").textContent = "Itens: " + data.ultimaDoacao.itens;
        document.getElementById("destinoUltimaDoacao").textContent = "Destino: " + data.ultimaDoacao.destino;
        document.getElementById("statusUltimaDoacao").textContent = "Status: " + data.ultimaDoacao.status;
      }
    })
    .catch(error => {
      console.error(error);
      alert("Erro ao carregar dados do dashboard.");
    });
});
