document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-redefinir");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const senha = document.getElementById("senha").value;
    const confirmar = document.getElementById("confirmarSenha").value;
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      showToast("Token inválido ou ausente.", "error");
      return;
    }

    if (senha !== confirmar) {
      showToast("As senhas não coincidem.", "error");
      return;
    }

    try {
      const response = await fetch("https://conexao-alimentar.onrender.com/auth/redefinir-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, novaSenha: senha })
      });

      if (response.ok) {
        showToast("Senha redefinida com sucesso! Redirecionando...", "success");
        setTimeout(() => {
          window.location.href = "../cadastrologin/login.html";
        }, 2500);
      } else {
        const msg = await response.text();
        showToast(msg || "Erro ao redefinir a senha.", "error");
      }
    } catch (err) {
      showToast("Erro na solicitação.", "error");
    }
  });
});

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return console.error("Toast container não encontrado.");

  const toast = document.createElement("div");
  toast.className = `p-4 rounded-lg shadow-md text-white flex items-center justify-between transition-all duration-500 ease-in-out ${
    type === "success" ? "bg-green-500" : "bg-red-500"
  }`;
  toast.innerHTML = `
    <span>${message}</span>
    <button class="ml-4 text-white hover:text-gray-200">&times;</button>
  `;

  toast.querySelector("button").addEventListener("click", () => toast.remove());
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}
