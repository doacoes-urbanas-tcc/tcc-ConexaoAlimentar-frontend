document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const idDoacao = params.get("id");
  const infoDoacao = document.getElementById("info-doacao");
  const btnConfirmar = document.getElementById("btnConfirmar");
  const token = localStorage.getItem("token");
  let doacao = null; // variável para guardar os dados

  if (!idDoacao || !token) {
    showError("ID de doação inválido ou usuário não está logado.");
    window.location.href = "/pages/doacao/lista-doacoes.html";
    return;
  }

  try {
    const response = await fetch(`https://conexao-alimentar.onrender.com/doacoes/${idDoacao}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar dados da doação.");
    }

    doacao = await response.json();

    infoDoacao.innerHTML = `
      <h3 class="text-xl font-semibold text-red-600">${doacao.nomeAlimento}</h3>
      <p class="text-gray-700">${doacao.descricao}</p>
      <p><strong>Categoria:</strong> ${doacao.categoria}</p>
      <p><strong>Quantidade:</strong> ${doacao.quantidade} ${doacao.unidadeMedida}</p>
      <p><strong>Validade:</strong> ${formatarData(doacao.dataValidade)}</p>
      <p><strong>Data de Cadastro:</strong> ${formatarDataHora(doacao.dataCadastro)}</p>
    `;
  } catch (err) {
    console.error(err);
    infoDoacao.innerHTML = "<p class='text-red-600'>Erro ao carregar dados da doação.</p>";
  }

  btnConfirmar.addEventListener("click", async () => {
    if (localStorage.getItem("dadosDoacaoParaGeo")) {
      window.location.href = `/pages/reserva/qrcode.html?id=${idDoacao}`;
      return;
    }

    try {
      const response = await fetch("https://conexao-alimentar.onrender.com/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ doacaoId: idDoacao })
      });

      if (!response.ok) {
        const erro = await response.text();
        showError("Erro ao reservar: " + erro);
        return;
      }

      localStorage.setItem("dadosDoacaoParaGeo", JSON.stringify({
        nomeAlimento: doacao.nomeAlimento,
        doadorNome: doacao.usuario?.nome || "Doador",
        endereco: doacao.endereco,
        latitude: doacao.latitude,
        longitude: doacao.longitude,
        quantidade: doacao.quantidade,
        unidadeMedida: doacao.unidadeMedida,
        categoria: doacao.categoria,
        dataValidade: doacao.dataValidade,
        descricao: doacao.descricao,
        contato: doacao.contato,
        urlImagem: doacao.urlImagem
      }));

      window.location.href = `/pages/reserva/qrcode.html?id=${idDoacao}`;
    } catch (err) {
      showError("Erro ao tentar reservar a doação.");
    }
  });

});

function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR");
}

function formatarDataHora(dataHora) {
  return new Date(dataHora).toLocaleString("pt-BR");
}

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
  const msgEl = document.getElementById('mensagem-erro');
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
