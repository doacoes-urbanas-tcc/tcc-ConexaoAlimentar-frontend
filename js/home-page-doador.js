document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const nomeUsuario = localStorage.getItem("nome") || "Doador";

  if (!token) {
    window.location.href = "/pages/cadastrologin/login.html";
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
      document.getElementById("nome").textContent = data.nome || nomeUsuario;
      document.getElementById("totalDoacoes").textContent = data.totalDoacoes;
      document.getElementById("ongsBeneficiadas").textContent = data.ongsBeneficiadas;
      document.getElementById("mediaAvaliacoes").textContent = `${(data.mediaAvaliacoes || 0).toFixed(1)} ★`;

      const ultimaDoacaoElements = [
        "dataUltimaDoacao",
        "itensUltimaDoacao",
        "destinoUltimaDoacao",
        "statusUltimaDoacao"
      ];
      ultimaDoacaoElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
      });
    })
    .catch(error => {
      console.error(error);
      showToast("Erro ao carregar dados do dashboard.", "error");
    });
});

/**
 * Função de toast (reutilizável)
 * @param {string} message - Texto da mensagem
 * @param {"success" | "error"} type - Tipo de toast
 */
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
