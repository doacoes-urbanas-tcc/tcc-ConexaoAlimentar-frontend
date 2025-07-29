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
    document.getElementById('campoTipoVoluntario').classList.add('hidden');
    document.getElementById('campoDocumentoComprovante').classList.add('hidden');
    document.getElementById('nomeFantasia').classList.add('hidden');
    document.getElementById('tipoComercio').classList.add('hidden');

    const descricoes = {
        pf: "Pessoa comum que deseja doar alimentos ou produtos como indivíduo.",
        cnpj: "Estabelecimentos comerciais ou empresas que fazem doações como pessoa jurídica.",
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
            case 'cnpj':
                document.getElementById('campoCNPJ').classList.remove('hidden');
                document.getElementById('nomeFantasia').classList.remove('hidden');
                document.getElementById('tipoComercio').classList.remove('hidden');
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
                document.getElementById('campoTipoVoluntario').classList.remove('hidden');
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
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        senha: document.getElementById('password').value,
        telefone: document.getElementById('telefone').value,
        cep: document.getElementById('cep').value,
        endereco: document.getElementById('endereco').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        latitude,
        longitude
    };

    if (tipoUsuario === "pf" || tipoUsuario === "voluntario" || tipoUsuario === "admin") {
        dados.cpf = document.getElementById('cpf').value.replace(/\D/g, '');
        dados.documentoComprovante = document.getElementById('documentoComprovante').value;
    }


    if (tipoUsuario === "voluntario") {
        dados.tipoVoluntario = document.getElementById('tipoVoluntario').value;
        dados.documentoComprovante = document.getElementById('documentoComprovante').value;
        dados.tipoVoluntario = document.getElementById('tipoVoluntario').value;
    }

    if (tipoUsuario === "rural") {
        dados.numeroRegistroRural = document.getElementById('numeroRegistroRural').value;
    }

    if (tipoUsuario === "ong") {
        dados.cnpj = document.getElementById('cnpj').value;
        dados.descricao = document.getElementById('descricaoONG').value;
    }

    if (tipoUsuario === "cnpj") {
        dados.nomeFantasia = document.getElementById('nomeFantasia').value;
        dados.tipoComercio = document.getElementById('tipoComercio').value;
    }

    try {
        await yup.object().shape({
            nome: yup.string().required("O nome é obrigatório"),
            email: yup.string().email("Email inválido").required("O email é obrigatório"),
            senha: yup.string().min(6).required("A senha é obrigatória"),
            telefone: yup.string().required("O telefone é obrigatório"),
            cep: yup.string().required("O CEP é obrigatório"),
            endereco: yup.string().required("O endereço é obrigatório"),
            cidade: yup.string().required("A cidade é obrigatória"),
            estado: yup.string().required("O estado é obrigatório"),
        }).validate(dados, { abortEarly: false });

        const tipoMapeado = {
            pf: "pessoa-fisica",
            cnpj: "comercio",
            ong: "ong",
            rural: "produtor-rural",
            voluntario: "voluntario",
            admin: "admin"
        };

        const endpoint = `http://localhost:8080/${tipoMapeado[tipoUsuario]}/cadastrar`;

        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            alert("Cadastro realizado com sucesso!");
            window.location.href = "/pages/cadastrologin/login.html";
        } else {
            const res = await response.json();
            console.error("Erro no cadastro:", res);
            alert("Erro ao cadastrar: " + (res.message || "Verifique os dados."));
        }

    } catch (err) {
        if (err.name === 'ValidationError') {
            erros.innerHTML = err.errors.map(e => `<p class="text-red-600 text-sm">${e}</p>`).join('');
        } else {
            console.error("Erro inesperado:", err);
            alert("Erro inesperado no envio do formulário.");
        }
    }
});
