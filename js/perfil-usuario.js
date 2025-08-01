document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const tipo = urlParams.get("tipo")?.toUpperCase();
  const token = localStorage.getItem("token");
  const tipoUsuarioLogado = localStorage.getItem("tipoUsuario");

  const isAdmin = tipoUsuarioLogado === "ADMIN";

  if (!id || !tipo) {
    alert("Dados inválidos na URL");
    return;
  }

  fetch(`http://localhost:8080/admin/usuarios/perfil?id=${id}&tipo=${tipo}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao carregar perfil");
      return res.json();
    })
    .then(dados => preencherPerfil(dados, tipo, isAdmin))
    .catch(err => {
      console.error("Erro:", err);
      alert("Erro ao carregar dados do perfil.");
    });

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
      info.appendChild(criarCampo("Ativo", dados.ativo ? "Sim" : "Não"));
      if (dados.justificativaReprovacao) {
        info.appendChild(criarCampo("Justificativa de Reprovação", dados.justificativaReprovacao));
      }
    }

    if (isAdmin) {
      document.getElementById("botoesAdmin").classList.remove("hidden");

      document.getElementById("btnAprovar").onclick = () => atualizarStatus("aprovar");
      document.getElementById("btnReprovar").onclick = () => atualizarStatus("reprovar");
    }
  }

  function atualizarStatus(acao) {
    fetch(`http://localhost:8080/admin/usuarios/${acao}/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.ok) {
          alert(`Usuário ${acao === "aprovar" ? "aprovado" : "reprovado"} com sucesso.`);
          window.location.href = "usuarios-pendentes.html";
        } else {
          alert("Erro ao atualizar status.");
        }
      });
  }
});
