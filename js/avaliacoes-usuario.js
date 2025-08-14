'use strict';

document.addEventListener("DOMContentLoaded", async () => {
  const lista = document.getElementById("lista-avaliacoes");
  const urlParams = new URLSearchParams(window.location.search);
  let avaliadoId = urlParams.get("avaliadoId");
  const token = localStorage.getItem("token");
  const usuarioIdLogado = localStorage.getItem("usuarioId");

  if (!avaliadoId) {
    if (!usuarioIdLogado) {
      lista.innerHTML = "<p class='text-gray-700'>ID do usuário não encontrado para carregar avaliações.</p>";
      return;
    }
    avaliadoId = usuarioIdLogado;
  }

  try {
    const resp = await fetch(`https://conexao-alimentar.onrender.com/avaliacoes/${avaliadoId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!resp.ok) throw new Error("Erro ao carregar avaliações");

    const avaliacoes = await resp.json();

    if (avaliacoes.length === 0) {
      lista.innerHTML = "<p class='text-gray-700'>Nenhuma avaliação encontrada.</p>";
      return;
    }

    lista.innerHTML = "";

    avaliacoes.forEach(avaliacao => {
      const item = document.createElement("div");
      item.className = "bg-white p-4 rounded shadow mb-4";

      const estrelas = "★".repeat(avaliacao.nota) + "☆".repeat(5 - avaliacao.nota);

      const data = new Date(avaliacao.dataCriacao);
      const dataFormatada = data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });

      item.innerHTML = `
        <div class="flex items-center gap-4 mb-4">
          <img src="${avaliacao.fotoAvaliador || '/assets/default-avatar.png'}" alt="Foto Avaliador" class="w-12 h-12 rounded-full object-cover border" />
          <div>
            <p class="font-semibold text-gray-800">${avaliacao.nomeAvaliador || 'Usuário'}</p>
            <p class="text-sm text-gray-500">${dataFormatada}</p>
          </div>
        </div>
        <div class="flex justify-between items-center mb-2">
          <div class="text-yellow-400 font-bold text-lg">${estrelas}</div>
        </div>
        <p class="text-gray-800">${avaliacao.comentario}</p>
      `;

      lista.appendChild(item);
    });
  } catch (err) {
    showToast(`Erro: ${err.message}`, 'error');
  }
});

function showToast(message, type = 'success', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  container.innerHTML = ''; 

  const toast = document.createElement('div');
  toast.className = `
    flex items-center px-4 py-3 rounded-lg shadow-lg text-white
    ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}
    transform transition-all duration-300 opacity-0 translate-x-4
  `;
  toast.innerHTML = `
    <span class="flex-1">${message}</span>
    <button class="ml-3 text-white hover:text-gray-200 focus:outline-none">&times;</button>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('opacity-0', 'translate-x-4');
  });

  toast.querySelector('button').addEventListener('click', () => hideToast(toast));

  setTimeout(() => hideToast(toast), duration);
}

function hideToast(toast) {
  toast.classList.add('opacity-0', 'translate-x-4');
  setTimeout(() => toast.remove(), 300);
}
