'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const voluntarioId = localStorage.getItem("usuarioId");

    if (!voluntarioId) {
      showToast("ID do voluntário não encontrado. Faça o login novamente.", "error");
      return;
    }

    const placa = document.getElementById("placa").value.trim();
    const modelo = document.getElementById("modelo").value.trim();
    const cor = document.getElementById("cor").value.trim();
    const carga = document.getElementById("carga").value.trim();
    const cnhFile = document.getElementById("cnh").files[0];

    if (!placa || !modelo || !cor || !carga || !cnhFile) {
      showToast("Preencha todos os campos e selecione uma imagem da CNH.", "error");
      return;
    }

    const dto = { placa, modelo, cor, capacidadeCarga: carga };

    const formData = new FormData();
    formData.append("dados", new Blob([JSON.stringify(dto)], { type: "application/json" }));
    formData.append("cnh", cnhFile);

    const botao = form.querySelector("button[type=submit]");
    botao.disabled = true;
    botao.textContent = "Enviando...";

    try {
      const response = await fetch(`https://conexao-alimentar.onrender.com/${voluntarioId}/veiculo`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const resText = await response.text();
        throw new Error(resText || "Erro desconhecido");
      }

      showToast("Veículo cadastrado com sucesso!", "success");
      form.reset();

    } catch (err) {
      console.error(err);
      showToast("Erro ao enviar dados do veículo. Tente novamente.", "error");
    } finally {
      botao.disabled = false;
      botao.textContent = "Cadastrar";
    }
  });
});

/**
 * Função para exibir toast
 * @param {string} message - Mensagem do toast
 * @param {'success'|'error'} type - Tipo do toast
 */
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `px-4 py-3 rounded shadow text-white ${
    type === "success" ? "bg-green-500" : "bg-red-500"
  } animate-slideIn`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("opacity-0", "transition-opacity", "duration-500");
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}
