document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-esqueci");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    if (!email) {
      showToast("Por favor, informe um e-mail válido.", "error");
      return;
    }

    try {
      const response = await fetch("https://conexao-alimentar.onrender.com/auth/recuperar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        showToast("Um link de redefinição foi enviado para seu e-mail.", "success");
        form.reset();
      } else {
        showToast("Não foi possível enviar o e-mail. Verifique se está correto.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Erro na solicitação. Tente novamente.", "error");
    }
  });
});

/**
 * Exibe um toast de sucesso ou erro
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
