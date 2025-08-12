document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const origem = urlParams.get("origem") || "pendentes"; 
  const pagina = urlParams.get("page") || 1; 
  const tipo = urlParams.get("tipo")?.toUpperCase();
  const token = localStorage.getItem("token");
  const tipoUsuarioLogado = localStorage.getItem("tipoUsuario");

  const isAdmin = tipoUsuarioLogado === "ADMIN";
  let idUsuarioParaAcao = null;
  let tipoAcao = ""; 
  if (!id || !tipo) {
    showError("Dados inválidos na URL", )
    return;
  }

  fetch(`https://conexao-alimentar.onrender.com/admin/usuarios/perfil?id=${id}&tipo=${tipo}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao carregar perfil");
      return res.json();
    })
    .then(dados => preencherPerfil(dados, tipo, isAdmin))
    .catch(() => showError("Erro ao carregar dados do perfil."));

  function preencherPerfil(dados, tipo, isAdmin) {
    const info = document.getElementById("infoPerfil");
    const foto = document.getElementById("fotoPerfil");

    if (dados.fotoUrl) {
      const img = document.createElement("img");
      img.src = dados.fotoUrl;
      img.alt = "Foto de Perfil";
      img.className = "w-40 h-40 rounded-full object-cover shadow-lg";
      foto.appendChild(img);
    }

    function criarCampo(label, valor) {
      const div = document.createElement("div");
      div.innerHTML = `<strong class="text-gray-700">${label}:</strong><p class="text-gray-900">${valor || '-'}</p>`;
      return div;
    }

    info.appendChild(criarCampo("Nome", dados.nome || dados.nomeFantasia));
    info.appendChild(criarCampo("Email", dados.email));
    info.appendChild(criarCampo("Telefone", dados.telefone));

    if (dados.endereco) {
      const e = dados.endereco;
      info.appendChild(criarCampo("Endereço", `${e.logradouro}, ${e.numero} - ${e.bairro}, ${e.cidade} - ${e.estado}, ${e.cep}`));
    }

    switch (tipo) {
      case "COMERCIO":
        info.appendChild(criarCampo("CNPJ", dados.cnpj));
        info.appendChild(criarCampo("Nome Fantasia", dados.nomeFantasia));
        info.appendChild(criarCampo("Tipo de Comércio", dados.tipoComercio));
        break;
      case "ONG":
        info.appendChild(criarCampo("CNPJ", dados.cnpj));
        info.appendChild(criarCampo("Descrição", dados.descricao));
        break;
      case "PESSOA_FISICA":
        info.appendChild(criarCampo("CPF", dados.cpf));
        if (dados.documentoComprovante) {
          info.appendChild(criarCampo("Documento Comprovante", `<a class="text-blue-600 underline" href="${dados.documentoComprovante}" target="_blank">Ver documento</a>`));
        }
        break;
      case "PRODUTOR_RURAL":
        info.appendChild(criarCampo("Registro Rural", dados.numeroRegistroRural));
        break;
      case "VOLUNTARIO":
        info.appendChild(criarCampo("CPF", dados.cpf));
        info.appendChild(criarCampo("Setor de Atuação", dados.setorAtuacao));

        if (dados.setorAtuacao === "TI") {
          info.appendChild(criarCampo("Stack", dados.stackConhecimento));
          if (dados.certificacoes) {
            info.appendChild(criarCampo("Certificações", `<a class="text-blue-600 underline" href="${dados.certificacoes}" target="_blank">Ver certificações</a>`));
          }
          info.appendChild(criarCampo("Experiência", dados.experiencia));
          if (dados.linkedin) {
            info.appendChild(criarCampo("LinkedIn", `<a class="text-blue-600 underline" href="${dados.linkedin}" target="_blank">${dados.linkedin}</a>`));
          }
          if (dados.github) {
            info.appendChild(criarCampo("GitHub", `<a class="text-blue-600 underline" href="${dados.github}" target="_blank">${dados.github}</a>`));
          }
        }

        if (dados.setorAtuacao === "TRANSPORTE") {
          info.appendChild(criarCampo("Placa do Veículo", dados.placaVeiculo));
          info.appendChild(criarCampo("Modelo do Veículo", dados.modeloVeiculo));
          info.appendChild(criarCampo("Cor do Veículo", dados.corVeiculo));
          info.appendChild(criarCampo("Capacidade de Carga", dados.capacidadeCarga));
          info.appendChild(criarCampo("Foto da CNH", `<a class="text-blue-600 underline" href="${dados.fotoCNH}" target="_blank">Ver CNH</a>`));
        }
        break;
    }

        if (isAdmin) {
          const botoesDiv = document.getElementById("botoesAdmin");
          botoesDiv.classList.remove("hidden");

          const btnAprovar = document.getElementById("btnAprovar");
          const btnReprovar = document.getElementById("btnReprovar");
          const btnDesativar = document.getElementById("btnDesativar");

          btnAprovar.classList.add("hidden");
          btnReprovar.classList.add("hidden");
          btnDesativar.classList.add("hidden");

          if (dados.status === "ATIVO") {
            btnDesativar.classList.remove("hidden");
            btnDesativar.onclick = () => {
            tipoAcao = "desativar";
            idUsuarioParaAcao = dados.id;
            document.getElementById("inputJustificativa").value = "";
            document.getElementById("modalJustificativa").classList.remove("hidden");
         };
         } else {
            btnAprovar.classList.remove("hidden");
            btnReprovar.classList.remove("hidden");

            btnAprovar.onclick = () => atualizarStatus("aprovar");

            btnReprovar.onclick = () => {
            tipoAcao = "reprovar";
            idUsuarioParaAcao = dados.id;
            document.getElementById("inputJustificativa").value = "";
            document.getElementById("modalJustificativa").classList.remove("hidden");
        };
       }
       }
        const btnVoltar = document.getElementById("btnVoltar");
       if (btnVoltar) {
      btnVoltar.addEventListener("click", () => {
        window.location.href = `usuarios-${origem}.html?page=${pagina}`;
      });
    }
  }

      
      

  function atualizarStatus(acao) {
    fetch(`https://conexao-alimentar.onrender.com/admin/usuarios/${acao}/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.ok) {
          showSuccess(`Usuário ${acao} com sucesso.`);
          window.location.href = "usuarios-pendentes.html";
        } else {
          showError("Erro ao atualizar status.");
        }
      });
  }

  document.getElementById("btnCancelarReprovar").addEventListener("click", () => {
    document.getElementById("modalJustificativa").classList.add("hidden");
    idUsuarioParaAcao = null;
    tipoAcao = "";
  });
document.getElementById("btnConfirmarReprovar").addEventListener("click", () => {
  const justificativa = document.getElementById("inputJustificativa").value.trim();
  if (!justificativa) {
    showError("Por favor, insira a justificativa.");
    return;
  }

  if (!tipoAcao || !idUsuarioParaAcao) {
    showError("Ação inválida.");
    return;
  }

  const url = `https://conexao-alimentar.onrender.com/admin/usuarios/${tipoAcao}/${idUsuarioParaAcao}`;
  const payload = { motivo: justificativa };


  fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })
    .then(async res => {
      if (res.ok) {
        showSuccess(`Usuário ${tipoAcao} com sucesso.`);
        window.location.href = tipoAcao === "reprovar" ? "usuarios-pendentes.html" : "usuarios-ativos.html";
      } else {
        const msg = await res.text();
        showError(`Erro ao atualizar status.\nCódigo: ${res.status}\n${msg}`);
      }
    })
    .catch(err => {
      showError("Erro ao se comunicar com o servidor.");
    })
    .finally(() => {
      document.getElementById("modalJustificativa").classList.add("hidden");
      tipoAcao = "";
      idUsuarioParaAcao = null;
    });
});
});

function showSuccess(message, onOk = null) {
  const modal = document.getElementById('modalSuccess');
  const msgEl = document.getElementById('modalSuccessMessage');
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




