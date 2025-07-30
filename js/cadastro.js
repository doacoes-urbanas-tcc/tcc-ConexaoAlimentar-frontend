'use strict';

// Variáveis globais para geolocalização
let latitude = "";
let longitude = "";

// Função para mostrar descrição e campos conforme tipo de usuário
function mostrarDescricaoECampos() {
    const select = document.getElementById('tipoUsuario');
    const descricao = document.getElementById('descricaoUsuario');
    const container = document.getElementById('descricaoContainer');

    // Ocultar todos os campos específicos
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

        // Exibir campos conforme o tipo
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

// Função para limpar formulário de endereço
function limparFormulario() {
    document.getElementById('endereco').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('estado').value = '';
}

// CEP via API
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

// Evento global ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    mostrarDescricaoECampos();

    // Máscaras de input
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

    // Geolocalização
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

// Envio do formulário com validação
const form = document.getElementById('form');
const erros = document.getElementById('erros');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tipoUsuario = document.getElementById("tipoUsuario").value;

    const dados = {
    nome: document.getElementById("nome").value,
    telefone: document.getElementById("telefone").value,
    email: document.getElementById("email").value,
    senha: document.getElementById("password").value,
    tipoUsuario: document.getElementById("tipoUsuario").value.toUpperCase(),
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

    if (tipoUsuario === "pf"|| tipoUsuario === "admin") {
        dados.cpf = document.getElementById('cpf').value.replace(/\D/g, '');
        dados.documentoComprovante = document.getElementById('documentoComprovante').value;
    }

   if (tipoUsuario === "voluntario") {
    const setorSelect = document.getElementById('setorAtuacao');
    const comprovanteInput = document.getElementById('documentoComprovante');
    const cpfInput = document.getElementById('cpf');

    if (!setorSelect || !comprovanteInput || !cpfInput) {
        alert("Algum dos campos de voluntário não está presente. Verifique o tipo de usuário selecionado.");
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

    try {
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

    if ( tipoUsuario === "comercio") {
    const nomeFantasia = document.getElementById('nomeFantasia').value;
    const tipoComercio = document.getElementById('tipoComercio').value;

    console.log("Nome fantasia:", nomeFantasia);
    console.log("Tipo de comércio:", tipoComercio);

    dados.nomeFantasia = nomeFantasia;
    dados.tipoComercio = tipoComercio;
    }

    if (mensagensErro.length > 0) {
        erros.innerHTML = mensagensErro.map(e => `<p class="text-red-600 text-sm">${e}</p>`).join('');
        return;
    }


    const formData = new FormData();
    formData.append("dto", new Blob([JSON.stringify(dados)], { type: "application/json" }));
    formData.append("comprovante", document.getElementById("documentoComprovante").files[0]);
    const fileInput = document.getElementById("fotoUrl");
    if (fileInput.files.length > 0) {
    formData.append("file", fileInput.files[0]);
    } else {
    alert("Por favor, selecione uma foto de perfil.");
    return;
   }

    const tipoMapeado = {
        pf: "pessoa-fisica",
        comercio: "comercio",
        ong: "ong",
        rural: "produtor-rural",
        voluntario: "voluntario",
        admin: "admin"
    };

    const endpoint = `http://localhost:8080/${tipoMapeado[tipoUsuario]}/cadastrar`;

    try {
       const response = await fetch(endpoint, {
  method: "POST",
  body: formData
});

if (response.ok) {
const resBody = await response.json();
localStorage.setItem("usuarioId", resBody.id);

if (dados.setorAtuacao === "TI") {
  window.location.href = "/pages/voluntarios/perfil-ti.html";
} else if (dados.setorAtuacao === "TRANSPORTE") {
  window.location.href = "/pages/voluntarios/cadastrotransportador.html";
} else {
  window.location.href = "/pages/cadastrologin/login.html";
}
}

    } catch (err) {
        console.error("Erro inesperado:", err);
        alert("Erro inesperado no envio do formulário.");
    }
  } catch (err) {
    console.error("Erro inesperado:", err);
    alert("Erro inesperado no envio do formulário.");
  }
});
