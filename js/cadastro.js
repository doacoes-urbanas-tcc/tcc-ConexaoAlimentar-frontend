'use strict';

let latitude = "";
let longitude = "";
function mostrarDescricaoECampos() {
    const select = document.getElementById('tipoUsuario');
    const valorSelecionado = (select?.value || '').toLowerCase();
    const descricao = document.getElementById('descricaoUsuario');
    const container = document.getElementById('descricaoContainer');

    const campos = [
        'campoCPF',
        'campoCNPJ',
        'campoDescricaoONG',
        'campoRegistroRural',
        'campoSetorAtuacao',
        'campoDocumentoComprovante',
        'campoNomeFantasia',
        'campoTipoComercio'
    ];

    campos.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    const descricoes = {
        pf: "Pessoa comum que deseja doar alimentos ou produtos como indivíduo.",
        comercio: "Estabelecimentos comerciais ou empresas que fazem doações como pessoa jurídica.",
        ong: "Organizações que recebem e distribuem as doações para quem precisa.",
        rural: "Produtores do campo que desejam doar excedentes da produção.",
        voluntario: "Pessoas que ajudam em áreas como Transporte e TI.",
        admin: "Equipe de gestão ou desenvolvimento do sistema com acesso administrativo."
    };

    if (descricoes[valorSelecionado]) {
        descricao.textContent = descricoes[valorSelecionado];
        container?.classList.remove("hidden");

        switch (valorSelecionado) {
            case 'pf':
                document.getElementById('campoCPF')?.classList.remove('hidden');
                document.getElementById('campoDocumentoComprovante')?.classList.remove('hidden');
                break;
            case 'comercio':
                document.getElementById('campoCNPJ')?.classList.remove('hidden');
                document.getElementById('campoNomeFantasia')?.classList.remove('hidden');
                document.getElementById('campoTipoComercio')?.classList.remove('hidden');
                break;
            case 'ong':
                document.getElementById('campoCNPJ')?.classList.remove('hidden');
                document.getElementById('campoDescricaoONG')?.classList.remove('hidden');
                break;
            case 'rural':
                document.getElementById('campoRegistroRural')?.classList.remove('hidden');
                break;
            case 'voluntario':
                document.getElementById('campoCPF')?.classList.remove('hidden');
                document.getElementById('campoSetorAtuacao')?.classList.remove('hidden');
                document.getElementById('campoDocumentoComprovante')?.classList.remove('hidden');
                break;
        }
    } else {
        descricao.textContent = "";
        container?.classList.add("hidden");
    }
}

document.getElementById('tipoUsuario')?.addEventListener('change', mostrarDescricaoECampos);
document.getElementById('aceiteTermo')?.addEventListener('change', mostrarDescricaoECampos);



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

const getEl = (id) => document.getElementById(id);
const getVal = (id) => (getEl(id)?.value ?? "").trim();
const safeFile = (id) => {
  const input = getEl(id);
  return input && input.files && input.files.length ? input.files[0] : null;
};

const form = getEl('form');
const erros = getEl('erros');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (erros) erros.innerHTML = "";

  try {
    const tipoUsuario = (getVal("tipoUsuario") || "").toLowerCase();

    const dados = {
      nome: getVal("nome"),
      telefone: getVal("telefone"),
      email: getVal("email"),
      senha: getVal("password"),
      tipoUsuario: (getVal("tipoUsuario") || "").toUpperCase(),
      endereco: {
        cep: getVal("cep"),
        logradouro: getVal("endereco"),
        bairro: getVal("bairro"),
        cidade: getVal("cidade"),
        estado: getVal("estado"),
        numero: getVal("numero"),
        latitude: getVal("latitude") || null,
        longitude: getVal("longitude") || null
      }
    };

    const confirmar = getVal("confirmPassword");
    if (dados.senha !== confirmar) {
      erros.innerHTML = '<p class="text-red-600 text-sm">As senhas não coincidem.</p>';
      return;
    }

    if (tipoUsuario === "pf" || tipoUsuario === "admin") {
      dados.cpf = getVal('cpf').replace(/\D/g, '');
      dados.documentoComprovante = getVal('documentoComprovante');
    }
    if (tipoUsuario === "voluntario") {
      dados.setorAtuacao = getVal('setorAtuacao');
      dados.documentoComprovante = getVal('documentoComprovante');
      dados.cpf = getVal('cpf').replace(/\D/g, '');
    }
    if (tipoUsuario === "rural") {
      dados.numeroRegistroRural = getVal('numeroRegistroRural');
    }
    if (tipoUsuario === "ong") {
      dados.cnpj = getVal('cnpj');
      dados.descricao = getVal('descricaoONG');
    }
    if (tipoUsuario === "comercio") {
      dados.cnpj = getVal('cnpj');
      dados.nomeFantasia = getVal('nomeFantasia');
      dados.tipoComercio = getVal('tipoComercio');
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

    if (["pf", "voluntario", "admin"].includes(tipoUsuario)) {
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
      if (!dados.cnpj) mensagensErro.push("CNPJ é obrigatório.");
      if (!dados.nomeFantasia) mensagensErro.push("Nome fantasia é obrigatório.");
      if (!dados.tipoComercio) mensagensErro.push("Tipo de comércio é obrigatório.");
    }

    if (mensagensErro.length > 0) {
      if (erros) erros.innerHTML = mensagensErro.map(m => `<p class="text-red-600 text-sm">${m}</p>`).join('');
      return;
    }

    const formData = new FormData();
    formData.append("dto", new Blob([JSON.stringify(dados)], { type: "application/json" }));

    const comprovanteFile = safeFile("documentoComprovante");
    if (comprovanteFile) formData.append("comprovante", comprovanteFile);

    const fotoFile = safeFile("fotoUrl");
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
    const caminho = tipoMapeado[tipoUsuario];
    if (!caminho) {
      showError("Tipo de usuário inválido.");
      return;
    }
    const endpoint = `https://conexao-alimentar.onrender.com/${caminho}/cadastrar`;

    const response = await fetch(endpoint, { method: "POST", body: formData });

    const contentType = response.headers.get("content-type") || "";
    if (response.ok) {
      const resBody = contentType.includes("application/json") ? await response.json() : null;

      if (resBody?.id) {
        localStorage.setItem("usuarioId", String(resBody.id));
      }

      showSuccess("Cadastro realizado com sucesso!", () => {
        if ((dados.setorAtuacao || "").toUpperCase() === "TI") {
          window.location.href = "/pages/voluntario/perfil-ti.html";
        } else if ((dados.setorAtuacao || "").toUpperCase() === "TRANSPORTE") {
          window.location.href = "/pages/voluntario/cadastrotransportador.html";
        } else {
          window.location.href = "/pages/cadastrologin/login.html";
        }
      });

    } else {
      let mensagem;
      if (contentType.includes("application/json")) {
        const errJson = await response.json().catch(() => ({}));
        mensagem = errJson.message || errJson.error || JSON.stringify(errJson);
      } else {
        mensagem = await response.text();
      }
      console.error("Erro ao cadastrar:", mensagem);
      showError("Erro ao cadastrar usuário: " + (mensagem || "tente novamente."));
      return;
    }

  } catch (err) {
    console.error("Falha no envio:", err);
    showError("Erro inesperado no envio do formulário. " + (err?.message || ""));
    return;
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
function openModal() {
  const modal = document.getElementById('modalTermo');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}
document.addEventListener('DOMContentLoaded', function () {
  const TIPOS_COM_TERMO = ['ong', 'comercio', 'rural', "pf"];

  const selectTipo   = document.getElementById('tipoUsuario');
  const btnLerTermo  = document.getElementById('btnLerTermo');
  const btnCadastro  = document.getElementById('btnCadastro');
  const modal        = document.getElementById('modalTermo');
  const fecharModal  = document.getElementById('fecharModal');
  const conteudo     = document.getElementById('conteudoTermo');
  const labelAceite  = document.getElementById('labelAceite');
  const aceite       = document.getElementById('aceiteTermo');

  if (!selectTipo || !btnLerTermo || !btnCadastro || !modal || !fecharModal || !conteudo || !labelAceite || !aceite) {
    console.warn('[Termos] Algum elemento obrigatório não foi encontrado. Verifique os IDs no HTML.');
    return;
  }

  function enableSubmit() {
    btnCadastro.disabled = false;
    btnCadastro.classList.remove('bg-red-300', 'cursor-not-allowed');
    btnCadastro.classList.add('bg-red-700', 'hover:bg-red-800');
  }
  function disableSubmit() {
    btnCadastro.disabled = true;
    btnCadastro.classList.add('bg-red-300', 'cursor-not-allowed');
    btnCadastro.classList.remove('bg-red-700', 'hover:bg-red-800');
  }

  function resetModal() {
    conteudo.scrollTop = 0;
    aceite.checked = false;
    labelAceite.classList.add('hidden');
  }

  function openModal() {
    resetModal();
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    if (TIPOS_COM_TERMO.includes((selectTipo.value || '').toLowerCase().trim())) {
      disableSubmit();
    }
  }
  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  function aplicarRegraTipo() {
    const valor = (selectTipo.value || '').toLowerCase().trim();

    if (TIPOS_COM_TERMO.includes(valor)) {
      btnLerTermo.classList.remove('hidden'); 
      disableSubmit();                         
      resetModal();                           
    } else {
      btnLerTermo.classList.add('hidden');    
      enableSubmit();                           
      resetModal();
      closeModal();
    }
  }

  btnLerTermo.addEventListener('click', openModal);
  fecharModal.addEventListener('click', closeModal);

  conteudo.addEventListener('scroll', function () {
    const chegouNoFim = this.scrollTop + this.clientHeight >= this.scrollHeight - 10;
    if (chegouNoFim) {
      labelAceite.classList.remove('hidden');
    }
  });

  aceite.addEventListener('change', function () {
    if (this.checked) enableSubmit();
    else disableSubmit();
  });

  selectTipo.addEventListener('change', aplicarRegraTipo);

  aplicarRegraTipo();
});
