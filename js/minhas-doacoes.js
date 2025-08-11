document.addEventListener("DOMContentLoaded", async function () {
  const lista = document.getElementById("listaDoacoes");
  const token = localStorage.getItem("token");

  if (!token) {
    showError("Você precisa estar logado.", () => {
    window.location.href = "/pages/cadastrologin/login.html";
    return;
    });
  }

  try {
    const response = await fetch("https://conexao-alimentar.onrender.com/doacoes/minhas-doacoes", {
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
  </div>
`;




  lista.appendChild(card);
});

  } catch (error) {
    console.error(error);
    lista.innerHTML = "<p class='text-red-600 col-span-full'>Erro ao carregar suas doações.</p>";
  }
});

function showSuccess(message, onOk = null) {
  const modal = document.getElementById('modalSuccess');
  const msgEl = document.getElementById('mensagem-sucesso');
  msgEl.textContent = message;
  modal.classList.remove('hidden');

  function closeHandler() {
    modal.classList.add('hidden');
    if (onOk) onOk();
    removeListeners();
  }

  function removeListeners() {
    okBtn.removeEventListener('click', closeHandler);
    closeBtn.removeEventListener('click', closeHandler);
  }

  const okBtn = modal.querySelector('button.bg-green-500');
  const closeBtn = modal.querySelector('button.absolute');

  okBtn.addEventListener('click', closeHandler);
  closeBtn.addEventListener('click', closeHandler);
}

function showError(message, onOk = null) {
  const modal = document.getElementById('modalError');
  const msgEl = document.getElementById('modalErrorMessage');
  msgEl.textContent = message;
  modal.classList.remove('hidden');

  function closeHandler() {
    modal.classList.add('hidden');
    if (onOk) onOk();
    removeListeners();
  }

  function removeListeners() {
    okBtn.removeEventListener('click', closeHandler);
    closeBtn.removeEventListener('click', closeHandler);
  }

  const okBtn = modal.querySelector('button.bg-red-500');
  const closeBtn = modal.querySelector('button.absolute');

  okBtn.addEventListener('click', closeHandler);
  closeBtn.addEventListener('click', closeHandler);
}




