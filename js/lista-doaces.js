document.addEventListener("DOMContentLoaded", async () => {
  const lista = document.getElementById("lista-doacoes");
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:8080/doacoes", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const doacoes = await response.json();

    const doacoesFiltradas = doacoes.filter(d => d.status === "AGUARDANDO_RETIRADA");

    if (doacoesFiltradas.length === 0) {
      lista.innerHTML = "<p class='text-gray-600'>Nenhuma doação aguardando retirada no momento.</p>";
      return;
    }

    doacoesFiltradas.forEach(doacao => {
      const item = document.createElement("div");
      item.className = "bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-4";

      item.innerHTML = `
        <img src="${doacao.urlImagem}" alt="${doacao.nomeAlimento}" class="w-full md:w-48 h-48 object-cover rounded-lg">

        <div class="flex-1">
          <h2 class="text-xl font-semibold text-red-600">${doacao.nomeAlimento}</h2>
          <p class="text-gray-700 mb-1">${doacao.descricao}</p>

          <div class="text-sm text-gray-600 space-y-1 mt-2">
            <p><strong>Categoria:</strong> ${doacao.categoria}</p>
            <p><strong>Quantidade:</strong> ${doacao.quantidade} ${doacao.unidadeMedida.toLowerCase()}</p>
            <p><strong>Validade:</strong> ${formatarData(doacao.dataValidade)}</p>
            <p><strong>Doador:</strong> ${doacao.doadorNome}</p>
            <p><strong>Status:</strong> ${doacao.status.replace("_", " ")}</p>
            <p><strong>Data de Cadastro:</strong> ${formatarDataHora(doacao.dataCadastro)}</p>
            <p><strong>Expira em:</strong> ${formatarDataHora(doacao.dataExpiracao)}</p>
          </div>
        </div>
      `;

      lista.appendChild(item);
    });
  } catch (err) {
    console.error("Erro ao carregar doações:", err);
    lista.innerHTML = "<p class='text-red-600'>Erro ao carregar doações.</p>";
  }
});

function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR");
}

function formatarDataHora(dataHora) {
  return new Date(dataHora).toLocaleString("pt-BR");
}
