document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("lista-avaliacoes");

  const urlParams = new URLSearchParams(window.location.search);
  const avaliadoId = urlParams.get("id");

  const token = localStorage.getItem("token"); 

  if (!avaliadoId) {
    lista.innerHTML = "<p class='text-gray-700'>ID do usuário não especificado.</p>";
    return;
  }

  fetch(`http://localhost:8080/avaliacoes/${avaliadoId}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(resp => {
    if (!resp.ok) throw new Error("Erro ao carregar avaliações");
    return resp.json();
  })
  .then(avaliacoes => {
    if (avaliacoes.length === 0) {
      lista.innerHTML = "<p class='text-gray-700'>Nenhuma avaliação encontrada.</p>";
      return;
    }

    avaliacoes.forEach(avaliacao => {
      const item = document.createElement("div");
      item.className = "bg-white p-4 rounded shadow";

      const estrelas = "★".repeat(avaliacao.nota) + "☆".repeat(5 - avaliacao.nota);

      item.innerHTML = `
        <div class="flex justify-between items-center mb-2">
          <div class="text-yellow-400 font-bold text-lg">${estrelas}</div>
          <span class="text-sm text-gray-500">${new Date(avaliacao.dataAvaliacao).toLocaleDateString()}</span>
        </div>
        <p class="text-gray-800">${avaliacao.comentario}</p>
      `;

      lista.appendChild(item);
    });
  })
  .catch(err => {
    lista.innerHTML = `<p class='text-red-500'>Erro: ${err.message}</p>`;
  });
});
