
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  let latitude = "", longitude = "";

  const getEl = id => document.getElementById(id);
  const getVal = id => (getEl(id)?.value ?? "").trim();
  const safeFile = id => {
    const input = getEl(id);
    return input && input.files && input.files.length ? input.files[0] : null;
  };
  function showToast(message, type = 'success', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    container.innerHTML = '';

    const toast = document.createElement('div');
    toast.className = `
        flex items-center px-4 py-3 rounded-lg shadow-lg text-white
        ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}
        transform transition-all duration-300 opacity-0 translate-x-4
    `;
    toast.innerHTML = `
        <span class="flex-1">${message}</span>
        <button class="ml-3 text-white hover:text-gray-200 focus:outline-none">&times;</button>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.remove('opacity-0', 'translate-x-4');
    });

    toast.querySelector('button').addEventListener('click', () => {
        hideToast(toast);
    });

    setTimeout(() => hideToast(toast), duration);
}

function hideToast(toast) {
    toast.classList.add('opacity-0', 'translate-x-4');
    setTimeout(() => {
        if (toast.parentElement) {
            toast.parentElement.removeChild(toast);
        }
    }, 300);
}

  function mostrarDescricaoECampos() {
    const valor = (getVal('tipoUsuario') || '').toLowerCase();
    const descricao = getEl('descricaoUsuario');
    const container = getEl('descricaoContainer');
    const campos = [
      'campoCPF','campoCNPJ','campoDescricaoONG','campoRegistroRural',
      'campoSetorAtuacao','campoDocumentoComprovante','campoNomeFantasia','campoTipoComercio'
    ];
    campos.forEach(id => getEl(id)?.classList.add('hidden'));

    const descricoes = {
      pf: "Pessoa comum que deseja doar alimentos ou produtos como indivíduo.",
      comercio: "Estabelecimentos comerciais ou empresas que fazem doações como pessoa jurídica.",
      ong: "Organizações que recebem e distribuem as doações para quem precisa.",
      rural: "Produtores do campo que desejam doar excedentes da produção.",
      voluntario: "Pessoas que ajudam em áreas como Transporte e TI.",
      admin: "Equipe de gestão ou desenvolvimento do sistema com acesso administrativo."
    };

    if (descricoes[valor]) {
      descricao.textContent = descricoes[valor];
      container?.classList.remove("hidden");
      if (valor === 'pf') {
        getEl('campoCPF')?.classList.remove('hidden');
        getEl('campoDocumentoComprovante')?.classList.remove('hidden');
      }
      if (valor === 'comercio') {
        getEl('campoCNPJ')?.classList.remove('hidden');
        getEl('campoNomeFantasia')?.classList.remove('hidden');
        getEl('campoTipoComercio')?.classList.remove('hidden');
      }
      if (valor === 'ong') {
        getEl('campoCNPJ')?.classList.remove('hidden');
        getEl('campoDescricaoONG')?.classList.remove('hidden');
      }
      if (valor === 'rural') {
        getEl('campoRegistroRural')?.classList.remove('hidden');
      }
      if (valor === 'voluntario') {
        getEl('campoCPF')?.classList.remove('hidden');
        getEl('campoSetorAtuacao')?.classList.remove('hidden');
        getEl('campoDocumentoComprovante')?.classList.remove('hidden');
      }
    } else {
      descricao.textContent = "";
      container?.classList.add("hidden");
    }
  }

  getEl('tipoUsuario')?.addEventListener('change', mostrarDescricaoECampos);
  getEl('aceiteTermo')?.addEventListener('change', mostrarDescricaoECampos);

  const mask = (id, regex, mask) => {
    getEl(id)?.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '');
      e.target.value = v.replace(regex, mask);
    });
  };
  mask('telefone', /^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  mask('cep', /^(\d{5})(\d{3})$/, '$1-$2');
  mask('cpf', /^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  mask('cnpj', /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');

  const limparFormulario = () => ['endereco','bairro','cidade','estado'].forEach(id => getEl(id).value = '');
  const preencherFormulario = e => {
    getEl('endereco').value = e.logradouro;
    getEl('bairro').value = e.bairro;
    getEl('cidade').value = e.localidade;
    getEl('estado').value = e.uf;
  };
  const cepValido = cep => cep.length === 8 && /^[0-9]+$/.test(cep);
  getEl('cep')?.addEventListener('focusout', async () => {
    limparFormulario();
    const cep = getVal('cep').replace("-", "");
    if (cepValido(cep)) {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      data.erro ? getEl('endereco').value = 'CEP não encontrado!' : preencherFormulario(data);
    } else {
      getEl('endereco').value = 'CEP incorreto!';
    }
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      latitude = pos.coords.latitude;
      longitude = pos.coords.longitude;
      getEl('latitude').value = latitude;
      getEl('longitude').value = longitude;
    });
  }

  const TIPOS_COM_TERMO = ['ong', 'comercio', 'rural', 'pf'];
  const selectTipo = getEl('tipoUsuario');
  const btnLerTermo = getEl('btnLerTermo');
  const btnCadastro = getEl('btnCadastro');
  const modal = getEl('modalTermo');
  const fecharModal = getEl('fecharModal');
  const conteudo = getEl('conteudoTermo');
  const labelAceite = getEl('labelAceite');
  const aceite = getEl('aceiteTermo');

  const enableSubmit = () => {
    btnCadastro.disabled = false;
    btnCadastro.classList.remove('bg-red-300','cursor-not-allowed');
    btnCadastro.classList.add('bg-red-700','hover:bg-red-800');
  };
  const disableSubmit = () => {
    btnCadastro.disabled = true;
    btnCadastro.classList.add('bg-red-300','cursor-not-allowed');
    btnCadastro.classList.remove('bg-red-700','hover:bg-red-800');
  };
  const resetModal = () => {
    conteudo.scrollTop = 0;
    aceite.checked = false;
    labelAceite.classList.add('hidden');
  };

  btnLerTermo?.addEventListener('click', () => {
    resetModal();
    modal.classList.remove('hidden'); modal.classList.add('flex');
    if (TIPOS_COM_TERMO.includes((selectTipo.value || '').toLowerCase())) disableSubmit();
  });
  fecharModal?.addEventListener('click', () => {
    modal.classList.add('hidden'); modal.classList.remove('flex');
  });
  conteudo?.addEventListener('scroll', function() {
    if (this.scrollTop + this.clientHeight >= this.scrollHeight - 10) {
      labelAceite.classList.remove('hidden');
    }
  });
  aceite?.addEventListener('change', function() {
    this.checked ? enableSubmit() : disableSubmit();
  });
  selectTipo?.addEventListener('change', () => {
    const val = (selectTipo.value || '').toLowerCase();
    if (TIPOS_COM_TERMO.includes(val)) {
      btnLerTermo.classList.remove('hidden');
      disableSubmit();
    } else {
      btnLerTermo.classList.add('hidden');
      enableSubmit();
    }
  });

  const form = getEl('form');
  const erros = getEl('erros');

  form?.addEventListener('submit', async e => {
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

      if (dados.senha !== getVal("confirmPassword")) {
        erros.innerHTML = '<p class="text-red-600 text-sm">As senhas não coincidem.</p>';
        return;
      }

      if (["pf","admin","voluntario"].includes(tipoUsuario)) {
        dados.cpf = getVal('cpf').replace(/\D/g, '');
        dados.documentoComprovante = getVal('documentoComprovante');
      }
      if (tipoUsuario === "voluntario") dados.setorAtuacao = getVal('setorAtuacao');
      if (tipoUsuario === "rural") dados.numeroRegistroRural = getVal('numeroRegistroRural');
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
      if (tipoUsuario === "voluntario" && !dados.setorAtuacao) mensagensErro.push("O setor de atuação é obrigatório.");
      if (tipoUsuario === "rural" && !dados.numeroRegistroRural) mensagensErro.push("Número de registro rural é obrigatório.");
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
        showToast("Por favor, selecione uma foto de perfil.", "error");
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
        showToast("Erro ao cadastrar usuário", "error");
        return;
      }

      const endpoint = `https://conexao-alimentar.onrender.com/${caminho}/cadastrar`;
      const response = await fetch(endpoint, { method: "POST", body: formData });

      const contentType = response.headers.get("content-type") || "";
      if (response.ok) {
        const resBody = contentType.includes("application/json") ? await response.json() : null;
        if (resBody?.id) localStorage.setItem("usuarioId", String(resBody.id));
        showToast("Cadastro realizado com sucesso!", "success");
        setTimeout(() => {
          if ((dados.setorAtuacao || "").toUpperCase() === "TI") {
            window.location.href = "/pages/voluntario/perfil-ti.html";
          } else if ((dados.setorAtuacao || "").toUpperCase() === "TRANSPORTE") {
            window.location.href = "/pages/voluntario/cadastrotransportador.html";
          } else {
            window.location.href = "/pages/cadastrologin/login.html";
          }
        }, 2000);
      } else {
        let mensagem;
        if (contentType.includes("application/json")) {
          const errJson = await response.json().catch(() => ({}));
          mensagem = errJson.message || errJson.error || JSON.stringify(errJson);
        } else {
          mensagem = await response.text();
        }
        console.error("Erro ao cadastrar:", mensagem);
        showToast("Erro ao cadastrar usuário", "error");
      }

    } catch (err) {
      console.error("Falha no envio:", err);
      showToast("Erro ao cadastrar usuário", "error");
    }
  });

  mostrarDescricaoECampos();

});
