document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const nomeUsuario = localStorage.getItem("nomeUsuario") || "Doador";

  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  fetch("https://conexao-alimentar.onrender.com/doacoes/metricas", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao buscar métricas do dashboard");
      return res.json();
    })
    .then(data => {
      document.getElementById("nome").textContent = nomeUsuario;
      document.getElementById("totalDoacoes").textContent = data.totalDoacoes;
      document.getElementById("ongsBeneficiadas").textContent = data.ongsBeneficiadas;
      document.getElementById("mediaAvaliacoes").textContent = `${(data.mediaAvaliacoes || 0).toFixed(1)} ★`;

  
      const ultimaDoacaoElements = ["dataUltimaDoacao", "itensUltimaDoacao", "destinoUltimaDoacao", "statusUltimaDoacao"];
      ultimaDoacaoElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
      });
    })
    .catch(error => {
      console.error(error);
      alert("Erro ao carregar dados do dashboard.");
    });
});
