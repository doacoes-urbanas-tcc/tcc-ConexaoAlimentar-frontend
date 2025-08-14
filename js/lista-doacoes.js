document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  const podeContinuar = await verificarAvaliacoesPendentes(token);
  if (!podeContinuar) return;

  const lista = document.getElementById("lista-doacoes");

  try {
    const response = await fetch("https://conexao-alimentar.onrender.com/doacoes", {
      method: "GET",
      headers: { "Authorization": "Bearer " + token }
    });

    if (!response.ok) {
      showToast(`Erro ao carregar doações: ${response.status}`, "error");
      return;
    }

    const doacoes = await response.json();
    console.log("Doações recebidas:", doacoes);

    const doacoesFiltradas = doacoes.filter(d => d.status?.toUpperCase() === "PENDENTE");

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
            <p><strong>Quantidade:</strong> ${doacao.quantidade} ${doacao.unidadeMedida?.toLowerCase()}</p>
            <p><strong>Validade:</strong> ${formatarData(doacao.dataValidade)}</p>
            <p><strong>Doador:</strong> ${doacao.doadorNome}</p>
            <p><strong>Status:</strong> ${doacao.status.replace("_", " ")}</p>
            <p><strong>Data de Cadastro:</strong> ${formatarDataHora(doacao.dataCadastro)}</p>
            <p><strong>Expira em:</strong> ${formatarDataHora(doacao.dataExpiracao)}</p>
          </div>

          <button class="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition reservar-btn" data-id="${doacao.id}">
            Reservar
          </button>
        </div>
      `;

      const btnReservar = item.querySelector(".reservar-btn");
      btnReservar.addEventListener("click", () => {
        window.location.href = `/pages/reserva/confirmar-reserva.html?id=${doacao.id}`;
      });

      lista.appendChild(item);
    });
  } catch (err) {
    console.error("Erro ao carregar doações:", err);
    showToast("Erro ao carregar doações.", "error");
  }
});

async function verificarAvaliacoesPendentes(token) {
  try {
    const response = await fetch("https://conexao-alimentar.onrender.com/reservas/avaliacoes-pendentes", {
      headers: { "Authorization": "Bearer " + token }
    });

    if (!response.ok) return true;

    const reservasPendentes = await response.json();

    if (reservasPendentes.length > 0) {
      const reserva = reservasPendentes[0];
      showToast("Você precisa concluir suas avaliações antes de continuar.", "error");
      setTimeout(() => {
        window.location.href = `/pages/avaliacao/avaliacao.html?idReserva=${reserva.id}`;
      }, 2000);
      return false;
    }

    return true;
  } catch (err) {
    showToast("Erro ao verificar avaliações pendentes", "error");
    return true;
  }
}

function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR");
}

function formatarDataHora(dataHora) {
  return new Date(dataHora).toLocaleString("pt-BR");
}

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) {
    alert(message);
    return;
  }

  const toast = document.createElement("div");
  toast.className = `px-4 py-2 rounded shadow text-white ${
    type === "success" ? "bg-green-500" : "bg-red-500"
  } animate-fade-in-down`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}
