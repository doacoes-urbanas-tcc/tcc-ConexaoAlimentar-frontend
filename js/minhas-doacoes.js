"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  const lista = document.getElementById("listaDoacoes");
  const token = localStorage.getItem("token");

  if (!token) {
    showToast("Você precisa estar logado.", "error");
    setTimeout(() => {
      window.location.href = "/pages/cadastrologin/login.html";
    }, 1500);
    return;
  }

  try {
    const res = await fetch("https://conexao-alimentar.onrender.com/doacoes/minhas-doacoes", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Erro ao buscar doações.");

    const doacoes = await res.json();
    lista.innerHTML = "";

    if (!doacoes.length) {
      lista.innerHTML = "<p class='text-gray-600 col-span-full'>Você ainda não cadastrou nenhuma doação.</p>";
      return;
    }

    doacoes.forEach(doacao => {
      const card = document.createElement("div");
      card.className = "bg-white shadow rounded p-4";

      const dataFormatada = new Date(doacao.dataValidade).toLocaleDateString("pt-BR");
      const reservada = doacao.status === "AGUARDANDO_RETIRADA" && doacao.idReceptor;

      card.innerHTML = `
        <div class="flex gap-4 items-start">
          <img src="${doacao.urlImagem}" alt="${doacao.nomeAlimento}" 
               class="w-32 h-32 object-cover rounded-lg bg-gray-100">

          <div class="flex-1">
            <h3 class="text-lg font-semibold text-red-600">${doacao.nomeAlimento}</h3>
            <p><strong>Quantidade:</strong> ${doacao.quantidade} ${doacao.unidadeMedida}</p>
            <p><strong>Categoria:</strong> ${doacao.categoria}</p>
            <p><strong>Validade:</strong> ${dataFormatada}</p>
            <p class="text-sm text-gray-600 mt-2">${doacao.descricao || "Sem descrição."}</p>
            <p class="text-sm text-gray-800 font-bold mt-2">${doacao.status}</p>

            ${reservada ? `
              <p><strong>Reservada por:</strong> ${doacao.nomeReceptor}</p>
              <div class="mt-4 flex flex-wrap gap-3 items-center">
                <a href="/pages/administrador/perfil-usuario.html?id=${doacao.idReceptor}&tipo=${doacao.tipoReceptor}" 
                   class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition text-sm">
                   Ver Perfil da ONG
                </a>` 
              : ""
            }

            <a href="/pages/doacao/confirmar-exclusao.html?id=${doacao.id}" 
               class="text-sm text-red-600 font-semibold hover:underline">
               Excluir
            </a>
          </div>
        </div>
      `;

      lista.appendChild(card);
    });

  } catch (error) {
    console.error(error);
    lista.innerHTML = "<p class='text-red-600 col-span-full'>Erro ao carregar suas doações.</p>";
    showToast("Erro ao carregar suas doações.", "error");
  }
});

/**
 * Exibe um toast de sucesso ou erro
 * @param {string} message - Mensagem a ser exibida
 * @param {"success"|"error"} type - Tipo de toast
 */
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container") || createToastContainer();

  const toast = document.createElement("div");
  toast.className = `
    max-w-xs w-full rounded-lg shadow-lg p-4 flex items-center gap-3 text-white
    ${type === "success" ? "bg-green-500" : "bg-red-500"}
  `;
  toast.innerHTML = `
    <span class="text-sm font-medium">${message}</span>
    <button class="ml-auto text-white hover:text-gray-200">&times;</button>
  `;

  const closeBtn = toast.querySelector("button");
  closeBtn.addEventListener("click", () => toast.remove());

  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function createToastContainer() {
  const container = document.createElement("div");
  container.id = "toast-container";
  container.className = "fixed top-4 right-4 z-[9999] space-y-3";
  document.body.appendChild(container);
  return container;
}
