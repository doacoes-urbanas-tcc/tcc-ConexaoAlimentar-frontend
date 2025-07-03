//inserindo função que mostra a descrição do tipo de
//usuario a partir da escolha do select

function mostrarDescricao() {
    const select = document.getElementById('tipoUsuario');
    const descricao = document.getElementById('descricaoUsuario');
    const container = document.getElementById('descricaoContainer');

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
    } else {
        descricao.textContent = "";
        container.classList.add("hidden");
    }
}


//inserindo api CEP
'use strict';

const limparFormulario = (endereco) =>{
    document.getElementById('endereco').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('estado').value = '';
}


const preencherFormulario = (endereco) =>{
    document.getElementById('endereco').value = endereco.logradouro;
    document.getElementById('bairro').value = endereco.bairro;
    document.getElementById('cidade').value = endereco.localidade;
    document.getElementById('estado').value = endereco.uf;
}


const eNumero = (numero) => /^[0-9]+$/.test(numero);

const cepValido = (cep) => cep.length == 8 && eNumero(cep); 

const pesquisarCep = async() => {
    limparFormulario();
    
    const cep = document.getElementById('cep').value.replace("-","");
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    if (cepValido(cep)){
        const dados = await fetch(url);
        const endereco = await dados.json();
        if (endereco.hasOwnProperty('erro')){
            document.getElementById('endereco').value = 'CEP não encontrado!';
        }else {
            preencherFormulario(endereco);
        }
    }else{
        document.getElementById('endereco').value = 'CEP incorreto!';
    }
     
}

document.getElementById('cep')
        .addEventListener('focusout',pesquisarCep);

//final da api CEP


//fazendo validação dos dados com a lib schema yup e regex
const form = document.getElementById('form');
const erros = document.getElementById('erros');

const schema = yup.object().shape({
  nome: yup.string().required("O nome é obrigatório"),
  cpf: yup.string().matches(/^\d{11}$/, 'CPF deve ter 11 números, só dígitos').required("O cpf é obrigatório!"),
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
