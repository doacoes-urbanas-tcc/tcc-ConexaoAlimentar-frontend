const getEl = (id) => document.getElementById(id);
const getVal = (id) => (getEl(id)?.value ?? "").trim();
const safeFile = (id) => {
  const input = getEl(id);
  return input?.files?.length ? input.files[0] : null;
};

function mostrarDescricaoECampos() {
  const select = getEl('tipoUsuario');
  const valorSelecionado = (select?.value || '').toLowerCase();
  const descricao = getEl('descricaoUsuario');
  const container = getEl('descricaoContainer');

  const campos = [
    'campoCPF', 'campoCNPJ', 'campoDescricaoONG', 'campoRegistroRural',
    'campoSetorAtuacao', 'campoDocumentoComprovante', 'campoNomeFantasia', 'campoTipoComercio'
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

  if (descricoes[valorSelecionado]) {
    descricao.textContent = descricoes[valorSelecionado];
    container?.classList.remove("hidden");

    switch (valorSelecionado) {
      case 'pf':
        getEl('campoCPF')?.classList.remove('hidden');
        getEl('campoDocumentoComprovante')?.classList.remove('hidden');
        break;
      case 'comercio':
        getEl('campoCNPJ')?.classList.remove('hidden');
        getEl('campoNomeFantasia')?.classList.remove('hidden');
        getEl('campoTipoComercio')?.classList.remove('hidden');
        break;
      case 'ong':
        getEl('campoCNPJ')?.classList.remove('hidden');
        getEl('campoDescricaoONG')?.classList.remove('hidden');
        break;
      case 'rural':
        getEl('campoRegistroRural')?.classList.remove('hidden');
        break;
      case 'voluntario':
        getEl('campoCPF')?.classList.remove('hidden');
        getEl('campoSetorAtuacao')?.classList.remove('hidden');
        getEl('campoDocumentoComprovante')?.classList.remove('hidden');
        break;
    }
  } else {
    descricao.textContent = "";
    container?.classList.add("hidden");
  }
}

function showSuccess(message, onOk = null) {
  const modal = getEl('modalSuccess');
  const msgEl = getEl('mensagem-sucesso');
  if (!modal || !msgEl) return;

  msgEl.textContent = message;
  modal.classList.remove('hidden');

  const okBtn = modal.querySelector('button.bg-green-500');
  const closeBtn = modal.querySelector('button.absolute');

  const closeHandler = () => {
    modal.classList.add('hidden');
    if (onOk) onOk();
    okBtn?.removeEventListener('click', closeHandler);
    closeBtn?.removeEventListener('click', closeHandler);
  };

  okBtn?.addEventListener('click', closeHandler);
  closeBtn?.addEventListener('click', closeHandler);
}

function showError(message, onOk = null) {
  const modal = getEl('modalError');
  const msgEl = getEl('mensagem-erro');
  if (!modal || !msgEl) return;

  msgEl.textContent = message;
  modal.classList.remove('hidden');

  const okBtn = modal.querySelector('button.bg-red-500');
  const closeBtn = modal.querySelector('button.absolute');

  const closeHandler = () => {
    modal.classList.add('hidden');
    if (onOk) onOk();
    okBtn?.removeEventListener('click', closeHandler);
    closeBtn?.removeEventListener('click', closeHandler);
  };

  okBtn?.addEventListener('click', closeHandler);
  closeBtn?.addEventListener('click', closeHandler);
}

function configurarModalTermo() {
  const TIPOS_COM_TERMO = ['ong', 'comercio', 'rural', "pf"];
  const selectTipo = getEl('tipoUsuario');
  const btnLerTermo = getEl('btnLerTermo');
  const btnCadastro = getEl('btnCadastro');
  const modal = getEl('modalTermo');
  const fecharModal = getEl('fecharModal');
  const conteudo = getEl('conteudoTermo');
  const labelAceite = getEl('labelAceite');
  const aceite = getEl('aceiteTermo');

  if (!selectTipo || !btnLerTermo || !btnCadastro || !modal || !fecharModal || !conteudo || !labelAceite || !aceite) {
    console.warn('[Termos] Elementos não encontrados.');
    return;
  }

  const enableSubmit = () => {
    btnCadastro.disabled = false;
    btnCadastro.classList.remove('bg-red-300', 'cursor-not-allowed');
    btnCadastro.classList.add('bg-red-700', 'hover:bg-red-800');
  };

  const disableSubmit = () => {
    btnCadastro.disabled = true;
    btnCadastro.classList.add('bg-red-300', 'cursor-not-allowed');
    btnCadastro.classList.remove('bg-red-700', 'hover:bg-red-800');
  };

  const resetModal = () => {
    conteudo.scrollTop = 0;
    aceite.checked = false;
    labelAceite.classList.add('hidden');
  };

  const openModal = () => {
    resetModal();
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (TIPOS_COM_TERMO.includes(selectTipo.value.toLowerCase())) {
      disableSubmit();
    }
  };

  const closeModal = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  };

  const aplicarRegraTipo = () => {
    if (TIPOS_COM_TERMO.includes((selectTipo.value || '').toLowerCase())) {
      btnLerTermo.classList.remove('hidden');
      disableSubmit();
    } else {
      btnLerTermo.classList.add('hidden');
      enableSubmit();
      closeModal();
    }
  };

  btnLerTermo.addEventListener('click', openModal);
  fecharModal.addEventListener('click', closeModal);

  conteudo.addEventListener('scroll', () => {
    if (conteudo.scrollTop + conteudo.clientHeight >= conteudo.scrollHeight - 10) {
      labelAceite.classList.remove('hidden');
    }
  });

  aceite.addEventListener('change', () => aceite.checked ? enableSubmit() : disableSubmit());
  selectTipo.addEventListener('change', aplicarRegraTipo);

  aplicarRegraTipo();
}

document.addEventListener('DOMContentLoaded', () => {
  mostrarDescricaoECampos();
  configurarModalTermo();

  getEl('tipoUsuario')?.addEventListener('change', mostrarDescricaoECampos);

  getEl('telefone')?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '');
    e.target.value = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  });
  getEl('cep')?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '');
    e.target.value = v.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  });
  getEl('cpf')?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '');
    e.target.value = v.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  });
  getEl('cnpj')?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '');
    e.target.value = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  });

  getEl('cep')?.addEventListener('focusout', async () => {
    const cep = getVal('cep').replace("-", "");
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    if (/^[0-9]{8}$/.test(cep)) {
      const res = await fetch(url);
      const endereco = await res.json();
      if (endereco.erro) {
        getEl('endereco').value = 'CEP não encontrado!';
      } else {
        getEl('endereco').value = endereco.logradouro;
        getEl('bairro').value = endereco.bairro;
        getEl('cidade').value = endereco.localidade;
        getEl('estado').value = endereco.uf;
      }
    }
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      getEl('latitude').value = pos.coords.latitude;
      getEl('longitude').value = pos.coords.longitude;
    }, () => console.warn("Permissão de localização negada."));
  }
});
