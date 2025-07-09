//inserindo função que mostra a descrição do tipo de
//usuario a partir da escolha do select e gerencia os campos específicos

function mostrarDescricaoECampos() {
    const select = document.getElementById('tipoUsuario');
    const descricao = document.getElementById('descricaoUsuario');
    const container = document.getElementById('descricaoContainer');

    // ocultando campos específicos
    document.getElementById('campoCPF').classList.add('hidden');
    document.getElementById('campoCNPJ').classList.add('hidden');
    document.getElementById('campoDescricaoONG').classList.add('hidden');
    document.getElementById('campoRegistroRural').classList.add('hidden');
    document.getElementById('campoTipoVoluntario').classList.add('hidden');

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
        
        // mostrando campo de cada usuario
        switch(valorSelecionado) {
            case 'pf':
                document.getElementById('campoCPF').classList.remove('hidden');
                break;
            case 'cnpj':
                document.getElementById('campoCNPJ').classList.remove('hidden');
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
                break;
            case 'admin':
                document.getElementById('campoCPF').classList.remove('hidden');
                break;
        }
    } else {
        descricao.textContent = "";
        container.classList.add("hidden");
    }
}


document.addEventListener('DOMContentLoaded', function() {
    mostrarDescricaoECampos();
});

//inserindo api CEP
'use strict';

const limparFormulario = (endereco) => {
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
}


const eNumero = (numero) => /^[0-9]+$/.test(numero);

const cepValido = (cep) => cep.length == 8 && eNumero(cep);

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

}

document.getElementById('cep')
    .addEventListener('focusout', pesquisarCep);

//final da api CEP

// mascara de input
document.addEventListener('DOMContentLoaded', function() {
    // mascara para telefone
    const telefoneInput = document.getElementById('telefone');
    telefoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        e.target.value = value;
    });

    // mascara para CEP
    const cepInput = document.getElementById('cep');
    cepInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{5})(\d{3})$/, '$1-$2');
        e.target.value = value;
    });

    // mascara para CPF
    const cpfInput = document.getElementById('cpf');
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        e.target.value = value;
    });

    // mascara pra pj
    const cnpjInput = document.getElementById('cnpj');
    cnpjInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
        e.target.value = value;
    });
});

//fazendo validação dos dados com a lib schema yup e regex
const form = document.getElementById('form');
const erros = document.getElementById('erros');

const schema = yup.object().shape({
    nome: yup.string()
        .required("O nome é obrigatório"),
    telefone: yup.string()
        .min(11, "O número de telefone precisa conter 11 dígitos").
        max(11)
        .required("O número de telefone é obrigatório"),
    email: yup.string().email.
        required("O email é obrigatório"),
    password: yup.string()
        .min(6, "A senha deve ter pelo menos 6 dígitos")
        .required("A senha é obrigatória "),
    confirmPassword: yup.string()
        .required("Confirmar a senha é obrigatório")
        .oneOf([yup.ref("password")], "As senhas devem ser iguais"),
    cep: yup.string().min(8, "O CEP deve ter pelo menos 8 dígitos")
        .max(8).required("O CEP é obrigatório")
        .matches(/^\d{5}-\d{3}$/, 'CEP inválido'),
    cpf: yup.string().matches(/^\d{11}$/),
    cnpj: yup.string().matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/, 'CNPJ inválido'),
    numeroRegistroRural: yup.string().min(13).max(13),
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value.replace(/\D/g, ''),
    };

    try {
        await schema.validate(dados, { abortEarly: false });
        erros.innerHTML = "Tudo certo!";
    } catch (err) {
        erros.innerHTML = err.errors.map(msg => `<p>${msg}</p>`).join('');
    }
});