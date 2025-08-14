'use strict';

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const info = document.getElementById("infoDoacao");
  const btn = document.getElementById("btnConfirmar");
  const token = localStorage.getItem("token");

  if (!id || !token) {
    showToast("Requisição inválida.", "error");
    window.location.href = "/pages/doacao/minhas-doacoes.html";
    return;
  }

  try {
    const response = await fetch(`https://conexao-alimentar.onrender.com/doacoes/${id}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!response.ok) throw new Error("Erro ao buscar doação.");

    const doacao = await response.json();
    info.textContent = `Tem certeza que deseja excluir a doação "${doacao.nomeAlimento}"?`;
  } catch (e) {
    info.textContent = "Erro ao carregar dados da doação.";
    console.error(e);
  }

  btn.addEventListener("click", async () => {
    const confirmado = confirm("Essa ação não poderá ser desfeita. Deseja continuar?");
    if (!confirmado) return;

    try {
      const deleteResp = await fetch(`https://conexao-alimentar.onrender.com/doacoes/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + token
        }
      });

      if (!deleteResp.ok) throw new Error("Erro ao excluir doação.");

      showToast("Doação excluída com sucesso.", "success");
      setTimeout(() => {
        window.location.href = "/pages/doacao/minhas-doacoes.html";
      }, 2000);
    } catch (e) {
      console.error(e);
      showToast("Erro ao excluir doação.", "error");
    }
  });
});

function showToast(message, type = "success") {
  const toastContainer = document.getElementById("toast-container");
  if (!toastContainer) return console.error("Toast container não encontrado.");

  const toast = document.createElement("div");
  toast.className = `max-w-sm w-full p-4 rounded shadow-lg text-white ${
    type === "success" ? "bg-green-500" : "bg-red-500"
  }`;

  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
