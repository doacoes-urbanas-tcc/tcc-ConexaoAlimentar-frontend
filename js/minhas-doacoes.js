document.addEventListener("DOMContentLoaded", async function () {
  const lista = document.getElementById("listaDoacoes");
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa estar logado.");
    window.location.href = "/pages/cadastrologin/login.html";
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/doacoes/minhas-doacoes", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar doações.");
    }

    const doacoes = await response.json();

    if (!doacoes.length) {
      lista.innerHTML = "<p class='text-gray-600 col-span-full'>Você ainda não cadastrou nenhuma doação.</p>";
      return;
    }

    doacoes.forEach(doacao => {
      const card = document.createElement("div");
      card.className = "bg-white shadow rounded p-4";

      const dataFormatada = new Date(doacao.dataValidade).toLocaleDateString("pt-BR");

      card.innerHTML = `
        <img src="${doacao.urlImagem}" alt="${doacao.nomeAlimento}" class="w-full h-40 object-contain rounded mb-2 bg-gray-100">
        <h3 class="text-lg font-semibold">${doacao.nomeAlimento}</h3>
        <p><strong>Quantidade:</strong> ${doacao.quantidade} ${doacao.unidadeMedida}</p>
        <p><strong>Categoria:</strong> ${doacao.categoria}</p>
        <p><strong>Validade:</strong> ${dataFormatada}</p>
        <p class="text-sm text-gray-600 mt-2">${doacao.descricao || "Sem descrição."}</p>
        <p class="text-sm text-gray-600 mt-2">${doacao.status}</p>
        <a href="/pages/doacao/confirmar-exclusao.html?id=${doacao.id}" class="inline-block mt-3 text-sm text-red-600 font-semibold hover:underline">Excluir</a>
      `;

      lista.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    lista.innerHTML = "<p class='text-red-600 col-span-full'>Erro ao carregar suas doações.</p>";
  }
});