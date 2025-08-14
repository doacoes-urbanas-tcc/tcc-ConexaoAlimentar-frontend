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
    .then(res => {
      if (!res.ok) throw new Error("Erro ao carregar estatísticas");
      return res.json();
    })
    .then(data => {
      document.getElementById("nome").textContent = data.nome || "ONG";
      document.getElementById("totalDoacoesRecebidas").textContent = data.totalDoacoesRecebidas;
      document.getElementById("mediaAvaliacoes").textContent = (data.mediaAvaliacoes || 0).toFixed(1);
    })
    .catch(err => {
      console.error("Erro ao carregar estatísticas:", err);
      document.getElementById("nome").textContent = "ONG";
      showToast("Erro ao carregar estatísticas do dashboard.", "error");
    });
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
