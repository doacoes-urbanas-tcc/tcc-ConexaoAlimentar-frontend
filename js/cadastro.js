'use strict';

let latitude = "";
let longitude = "";

function mostrarDescricaoECampos() {
    const select = document.getElementById('tipoUsuario');
    const descricao = document.getElementById('descricaoUsuario');
    const container = document.getElementById('descricaoContainer');

    document.getElementById('campoCPF').classList.add('hidden');
    document.getElementById('campoCNPJ').classList.add('hidden');
    document.getElementById('campoDescricaoONG').classList.add('hidden');
    document.getElementById('campoRegistroRural').classList.add('hidden');
    document.getElementById('campoSetorAtuacao').classList.add('hidden');
    document.getElementById('campoDocumentoComprovante').classList.add('hidden');
    document.getElementById('campoNomeFantasia').classList.add('hidden');
    document.getElementById('campoTipoComercio').classList.add('hidden');

    const descricoes = {
        pf: "Pessoa comum que deseja doar alimentos ou produtos como indivíduo.",
        comercio: "Estabelecimentos comerciais ou empresas que fazem doações como pessoa jurídica.",
        ong: "Organizações que recebem e distribuem as doações para quem precisa.",
        rural: "Produtores do campo que desejam doar excedentes da produção.",
        voluntario: "Pessoas que ajudam em áreas como Transporte e TI.",
        admin: "Equipe de gestão ou desenvolvimento do sistema com acesso administrativo."
    };

    const valorSelecionado = select.value;
    if (descricoes[valorSelecionado]) {
        descricao.textContent = descricoes[valorSelecionado];
        container.classList.remove("hidden");

        switch (valorSelecionado) {
            case 'pf':
                document.getElementById('campoCPF').classList.remove('hidden');
                document.getElementById('campoDocumentoComprovante').classList.remove('hidden');
                break;
            case 'comercio':
                document.getElementById('campoCNPJ').classList.remove('hidden');
                document.getElementById('campoNomeFantasia').classList.remove('hidden');
                document.getElementById('campoTipoComercio').classList.remove('hidden');
                break;
            case 'ong':
                document.getElementById('campoCNPJ').classList.remove('hidden');
                document.getElementById('campoDescricaoONG').classList.remove('hidden');
                break;
            case 'rural':
                document.getElementById('campoRegistroRural').classList.remove('hidden');
                break;
            case 'voluntario':
                document.getElementById('campoCPF').classList.remove('hidden');
                document.getElementById('campoSetorAtuacao').classList.remove('hidden');
                document.getElementById('campoDocumentoComprovante').classList.remove('hidden');
                break;
        }
    } else {
        descricao.textContent = "";
        container.classList.add("hidden");
    }
}

function limparFormulario() {
    document.getElementById('endereco').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('estado').value = '';
}

const preencherFormulario = (endereco) => {
    document.getElementById('endereco').value = endereco.logradouro;
    document.getElementById('bairro').value = endereco.bairro;
    document.getElementById('cidade').value = endereco.localidade;
    document.getElementById('estado').value = endereco.uf;
};

const eNumero = (numero) => /^[0-9]+$/.test(numero);
const cepValido = (cep) => cep.length === 8 && eNumero(cep);

const pesquisarCep = async () => {
    limparFormulario();
    const cep = document.getElementById('cep').value.replace("-", "");
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    if (cepValido(cep)) {
        const dados = await fetch(url);
        const endereco = await dados.json();
        if (endereco.hasOwnProperty('erro')) {
            document.getElementById('endereco').value = 'CEP não encontrado!';
        } else {
            preencherFormulario(endereco);
        }
    } else {
        document.getElementById('endereco').value = 'CEP incorreto!';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    mostrarDescricaoECampos();

    document.getElementById('telefone').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        e.target.value = value;
    });

    document.getElementById('cep').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{5})(\d{3})$/, '$1-$2');
        e.target.value = value;
    });

    document.getElementById('cpf').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        e.target.value = value;
    });

    document.getElementById('cnpj').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
        e.target.value = value;
    });

    document.getElementById('cep').addEventListener('focusout', pesquisarCep);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            document.getElementById('latitude').value = latitude;
            document.getElementById('longitude').value = longitude;
        }, () => {
            console.warn("Permissão de localização negada.");
        });
    }
});

const form = document.getElementById('form');
const erros = document.getElementById('erros');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  erros.innerHTML = "";
  const tipoUsuario = document.getElementById("tipoUsuario").value;

   if (tipoUsuario === "ong" || tipoUsuario === "comercio") {
    if (!termoAceito) {
      e.preventDefault();
      modalTermo.classList.remove('hidden');
      return;
    }
  }


  const senha = document.getElementById("password").value;
  const confirmar = document.getElementById("confirmPassword").value;
  if (senha !== confirmar) {
    erros.innerHTML = '<p class="text-red-600 text-sm">As senhas não coincidem.</p>';
    return;
  }

  const dados = {
    nome: document.getElementById("nome").value,
    telefone: document.getElementById("telefone").value,
    email: document.getElementById("email").value,
    senha: senha,
    tipoUsuario: tipoUsuario.toUpperCase(),
    endereco: {
      cep: document.getElementById("cep").value,
      logradouro: document.getElementById("endereco").value,
      bairro: document.getElementById("bairro").value,
      cidade: document.getElementById("cidade").value,
      estado: document.getElementById("estado").value,
      numero: document.getElementById("numero").value,
      latitude: document.getElementById("latitude").value,
      longitude: document.getElementById("longitude").value
    }
  };

  if (tipoUsuario === "pf" || tipoUsuario === "admin") {
    dados.cpf = document.getElementById('cpf').value.replace(/\D/g, '');
    dados.documentoComprovante = document.getElementById('documentoComprovante').value;
  }
  if (tipoUsuario === "voluntario") {
    const setorSelect = document.getElementById('setorAtuacao');
    const comprovanteInput = document.getElementById('documentoComprovante');
    const cpfInput = document.getElementById('cpf');
    if (!setorSelect || !comprovanteInput || !cpfInput) {
      showError("Algum dos campos de voluntário não está presente. Verifique o tipo de usuário selecionado.");
      return;
    }
    dados.setorAtuacao = setorSelect.value;
    dados.documentoComprovante = comprovanteInput.value;
    dados.cpf = cpfInput.value.replace(/\D/g, '');
  }
  if (tipoUsuario === "rural") {
    dados.numeroRegistroRural = document.getElementById('numeroRegistroRural').value;
  }
  if (tipoUsuario === "ong") {
    dados.cnpj = document.getElementById('cnpj').value;
    dados.descricao = document.getElementById('descricaoONG').value;
  }
  if (tipoUsuario === "comercio") {
    dados.cnpj = document.getElementById('cnpj').value;
    dados.nomeFantasia = document.getElementById('nomeFantasia').value;
    dados.tipoComercio = document.getElementById('tipoComercio').value;
  }

  const mensagensErro = [];
  if (!dados.nome) mensagensErro.push("O nome é obrigatório.");
  if (!dados.email || !dados.email.includes("@")) mensagensErro.push("Email inválido.");
  if (!dados.senha || dados.senha.length < 6) mensagensErro.push("A senha deve ter no mínimo 6 caracteres.");
  if (!dados.telefone) mensagensErro.push("O telefone é obrigatório.");
  if (!dados.endereco.cep) mensagensErro.push("O CEP é obrigatório.");
  if (!dados.endereco.logradouro) mensagensErro.push("O endereço é obrigatório.");
  if (!dados.endereco.cidade) mensagensErro.push("A cidade é obrigatória.");
  if (!dados.endereco.estado) mensagensErro.push("O estado é obrigatório.");
  if (!dados.endereco.numero) mensagensErro.push("O número do endereço é obrigatório.");
  if (!dados.endereco.bairro) mensagensErro.push("O bairro é obrigatório.");
  if (!dados.endereco.latitude || !dados.endereco.longitude) mensagensErro.push("A localização é obrigatória.");
  if (tipoUsuario === "pf" || tipoUsuario === "voluntario" || tipoUsuario === "admin") {
    if (!dados.cpf) mensagensErro.push("O CPF é obrigatório.");
    if (!dados.documentoComprovante) mensagensErro.push("Documento comprovante é obrigatório.");
  }
  if (tipoUsuario === "voluntario" && !dados.setorAtuacao) {
    mensagensErro.push("O setor de atuação é obrigatório.");
  }
  if (tipoUsuario === "rural" && !dados.numeroRegistroRural) {
    mensagensErro.push("Número de registro rural é obrigatório.");
  }
  if (tipoUsuario === "ong") {
    if (!dados.cnpj) mensagensErro.push("CNPJ é obrigatório.");
    if (!dados.descricao) mensagensErro.push("Descrição da ONG é obrigatória.");
  }
  if (tipoUsuario === "comercio") {
    if (!dados.nomeFantasia) mensagensErro.push("Nome fantasia é obrigatório.");
    if (!dados.tipoComercio) mensagensErro.push("Tipo de comércio é obrigatório.");
  }

  if (mensagensErro.length > 0) {
    erros.innerHTML = mensagensErro.map(e => `<p class="text-red-600 text-sm">${e}</p>`).join('');
    return;
  }

  const formData = new FormData();
  formData.append("dto", new Blob([JSON.stringify(dados)], { type: "application/json" }));

  const comprovanteFile = document.getElementById("documentoComprovante").files[0];
  if (comprovanteFile) formData.append("comprovante", comprovanteFile);

  const fotoFile = document.getElementById("fotoUrl").files[0];
  if (!fotoFile) {
    showError("Por favor, selecione uma foto de perfil.");
    return;
  }
  formData.append("file", fotoFile);

  const tipoMapeado = {
    pf: "pessoa-fisica",
    comercio: "comercio",
    ong: "ong",
    rural: "produtor-rural",
    voluntario: "voluntario",
    admin: "admin"
  };

  const endpoint = `https://conexao-alimentar.onrender.com/${tipoMapeado[tipoUsuario]}/cadastrar`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    const contentType = response.headers.get("content-type") || "";

    if (response.ok) {
      let resBody;
      if (contentType.includes("application/json")) {
        resBody = await response.json();
      }
      form.addEventListener('submit', (e) => {
      if (!termoAceito) {
      e.preventDefault();
      modalTermo.classList.remove('hidden');
      }
      }, true);
      localStorage.setItem("usuarioId", resBody?.id);
      showSuccess("Cadastro realizado com sucesso!", () => {
        if (dados.setorAtuacao === "TI") {
        window.location.href = "/pages/voluntario/perfil-ti.html";
        } else if (dados.setorAtuacao === "TRANSPORTE") {
         window.location.href = "/pages/voluntario/cadastrotransportador.html";
        } else {
        window.location.href = "/pages/cadastrologin/login.html";
       }
      });

    } else {
      let erroMsg;
      if (contentType.includes("application/json")) {
        const erroJson = await response.json();
        erroMsg = erroJson.message || JSON.stringify(erroJson);
      } else {
        erroMsg = await response.text();
      }
      console.error("Erro ao cadastrar:", erroMsg);
      showError("Erro ao cadastrar usuário: " + erroMsg);
    }
  } catch (err) {
    showError("Erro inesperado no envio do formulário.");
    showError("Erro ao cadastrar usuário: " + erroMsg);
  }
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

function closeModal(modalId) {
document.getElementById(modalId).classList.add('hidden');
}
const modalTermo = document.getElementById('modalTermo');
const btnFecharTermo = document.getElementById('fecharTermo');
const btnConfirmarTermo = document.getElementById('confirmarTermo');
const checkAceiteTermo = document.getElementById('aceiteTermo');

let termoAceito = false;

btnFecharTermo.addEventListener('click', () => {
  modalTermo.classList.add('hidden');
});

btnConfirmarTermo.addEventListener('click', () => {
  if (!checkAceiteTermo.checked) {
    alert('Você deve aceitar os termos para continuar.');
    return;
  }
  termoAceito = true;
  modalTermo.classList.add('hidden');
  form.submit(); 
});





