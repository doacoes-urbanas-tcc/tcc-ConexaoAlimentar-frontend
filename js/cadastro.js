const getEl = (id) => document.getElementById(id);
const getVal = (id) => getEl(id)?.value?.trim() || "";
const safeFile = (id) => {
  const el = getEl(id);
  return el?.files?.length ? el.files[0] : null;
};
const onSafe = (id, event, handler) => {
  const el = getEl(id);
  if (el) {
    el.addEventListener(event, handler);
    return true;
  } else {
    console.warn(`Elemento com id="${id}" não encontrado para evento "${event}"`);
    return false;
  }
};
const closeModalById = (id) => {
  const modal = getEl(id);
  if (modal) modal.classList.add('hidden');
};

function showError(message, onOk = null) {
  closeModalById('modalSuccess');
  const modal = getEl('modalError');
  const msgEl = getEl('mensagem-erro');
  if (!modal || !msgEl) return;

  if (Array.isArray(message)) {
    msgEl.innerHTML = message.map(m => `<li>${m}</li>`).join("");
  } else {
    msgEl.textContent = message;
  }

  modal.classList.remove('hidden');
  const okBtn = modal.querySelector('button.bg-red-500');
  const closeBtn = modal.querySelector('button.absolute');

  function closeHandler() {
    modal.classList.add('hidden');
    if (onOk) onOk();
    removeListeners();
  }
  function removeListeners() {
    okBtn?.removeEventListener('click', closeHandler);
    closeBtn?.removeEventListener('click', closeHandler);
  }
  okBtn?.addEventListener('click', closeHandler);
  closeBtn?.addEventListener('click', closeHandler);
}

function showSuccess(message, onOk = null) {
  closeModalById('modalError');
  const modal = getEl('modalSuccess');
  const msgEl = getEl('mensagem-sucesso');
  if (!modal || !msgEl) return;

  msgEl.textContent = message;
  modal.classList.remove('hidden');

  const okBtn = modal.querySelector('button.bg-green-500');
  const closeBtn = modal.querySelector('button.absolute');

  function closeHandler() {
    modal.classList.add('hidden');
    if (onOk) onOk();
    removeListeners();
  }
  function removeListeners() {
    okBtn?.removeEventListener('click', closeHandler);
    closeBtn?.removeEventListener('click', closeHandler);
  }
  okBtn?.addEventListener('click', closeHandler);
  closeBtn?.addEventListener('click', closeHandler);
}

document.addEventListener('DOMContentLoaded', () => {
  mostrarDescricaoECampos();

  onSafe('telefone', 'input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    e.target.value = v;
  });
  onSafe('cep', 'input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    v = v.replace(/^(\d{5})(\d{3})$/, '$1-$2');
    e.target.value = v;
  });
  onSafe('cpf', 'input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    v = v.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    e.target.value = v;
  });
  onSafe('cnpj', 'input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    e.target.value = v;
  });

  onSafe('cep', 'focusout', pesquisarCep);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        getEl('latitude') && (getEl('latitude').value = pos.coords.latitude);
        getEl('longitude') && (getEl('longitude').value = pos.coords.longitude);
      },
      () => console.warn("Permissão de localização negada.")
    );
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const TIPOS_COM_TERMO = ['ong', 'comercio', 'rural', 'pf'];
  const selectTipo  = getEl('tipoUsuario');
  const btnLerTermo = getEl('btnLerTermo');
  const btnCadastro = getEl('btnCadastro');
  const modal       = getEl('modalTermo');
  const fecharModal = getEl('fecharModal');
  const conteudo    = getEl('conteudoTermo');
  const labelAceite = getEl('labelAceite');
  const aceite      = getEl('aceiteTermo');

  if ([selectTipo, btnLerTermo, btnCadastro, modal, fecharModal, conteudo, labelAceite, aceite].some(el => !el)) {
    console.warn('[Termos] Algum elemento obrigatório não foi encontrado.');
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
    if (TIPOS_COM_TERMO.includes((selectTipo.value || '').toLowerCase())) {
      disableSubmit();
    }
  };
  const closeModal = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  };
  const aplicarRegraTipo = () => {
    const valor = (selectTipo.value || '').toLowerCase();
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
  };

  btnLerTermo.addEventListener('click', openModal);
  fecharModal.addEventListener('click', closeModal);
  conteudo.addEventListener('scroll', function () {
    if (this.scrollTop + this.clientHeight >= this.scrollHeight - 10) {
      labelAceite.classList.remove('hidden');
    }
  });
  aceite.addEventListener('change', function () {
    this.checked ? enableSubmit() : disableSubmit();
  });
  selectTipo.addEventListener('change', aplicarRegraTipo);

  aplicarRegraTipo();
});

const form = getEl('form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      const tipoUsuario = getVal("tipoUsuario").toLowerCase();
      const dados = {
        nome: getVal("nome"),
        telefone: getVal("telefone"),
        email: getVal("email"),
        senha: getVal("password"),
        tipoUsuario: getVal("tipoUsuario").toUpperCase(),
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

      const erros = [];
      if (!dados.nome) erros.push("O nome é obrigatório.");
      if (!dados.telefone) erros.push("O telefone é obrigatório.");
      if (!dados.email) erros.push("O e-mail é obrigatório.");
      if (!dados.senha) erros.push("A senha é obrigatória.");
      if (dados.senha !== confirmar) erros.push("As senhas não coincidem.");
      if (!dados.endereco.cep) erros.push("O CEP é obrigatório.");
      if (!dados.endereco.logradouro) erros.push("O logradouro é obrigatório.");
      if (!dados.endereco.numero) erros.push("O número é obrigatório.");
      if (!dados.endereco.bairro) erros.push("O bairro é obrigatório.");
      if (!dados.endereco.cidade) erros.push("A cidade é obrigatória.");
      if (!dados.endereco.estado) erros.push("O estado é obrigatório.");

      if (tipoUsuario === "pf" || tipoUsuario === "admin") {
        if (!getVal('cpf')) erros.push("O CPF é obrigatório.");
      }
      if (tipoUsuario === "voluntario") {
        if (!getVal('cpf')) erros.push("O CPF é obrigatório.");
        if (!getVal('setorAtuacao')) erros.push("O setor de atuação é obrigatório.");
      }
      if (tipoUsuario === "rural") {
        if (!getVal('numeroRegistroRural')) erros.push("O número de registro rural é obrigatório.");
      }
      if (tipoUsuario === "ong") {
        if (!getVal('cnpj')) erros.push("O CNPJ é obrigatório.");
        if (!getVal('descricaoONG')) erros.push("A descrição da ONG é obrigatória.");
      }
      if (tipoUsuario === "comercio") {
        if (!getVal('cnpj')) erros.push("O CNPJ é obrigatório.");
        if (!getVal('nomeFantasia')) erros.push("O nome fantasia é obrigatório.");
        if (!getVal('tipoComercio')) erros.push("O tipo de comércio é obrigatório.");
      }

      const fotoFile = safeFile("fotoUrl");
      if (!fotoFile) erros.push("A foto de perfil é obrigatória.");

      if (erros.length > 0) {
        showError(erros);
        return;
      }

      const formData = new FormData();
      formData.append("dto", new Blob([JSON.stringify(dados)], { type: "application/json" }));
      const comprovanteFile = safeFile("documentoComprovante");
      if (comprovanteFile) formData.append("comprovante", comprovanteFile);
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
        if (resBody?.id) localStorage.setItem("usuarioId", String(resBody.id));
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
        showError("Erro ao cadastrar usuário: " + (mensagem || "tente novamente."));
      }

    } catch (err) {
      showError("Erro inesperado no envio do formulário. " + (err?.message || ""));
    }
  });
} else {
  console.warn('Formulário principal (#form) não encontrado.');
}
