'use strict';

function toastSuccess(message) {
  showToast(message, "bg-green-500");
}

function toastError(message) {
  showToast(message, "bg-red-500");
}

function toastInfo(message) {
  showToast(message, "bg-blue-500");
}

function showToast(message, bgColor) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `${bgColor} text-white px-4 py-2 rounded shadow-lg animate-slideInRight`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("animate-fadeOut");
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}


const filtroTipo = document.getElementById("filtroTipo");
const tabela = document.getElementById("tabelaUsuarios");
const token = localStorage.getItem("token");

const tiposMap = {
  "comercios": "COMERCIO",
  "ongs": "ONG",
  "pessoas-fisicas": "PESSOA_FISICA",
  "produtores-rurais": "PRODUTOR_RURAL",
  "voluntarios": "VOLUNTARIO"
};

function formatarTipo(tipo) {
  const formatado = {
    COMERCIO: "Comércio",
    ONG: "ONG",
    PESSOA_FISICA: "Pessoa Física",
    PRODUTOR_RURAL: "Produtor Rural",
    VOLUNTARIO: "Voluntário"
  };
  return formatado[tipo] || tipo || "Não informado";
}

filtroTipo.addEventListener("change", carregarUsuariosPendentes);
document.addEventListener("DOMContentLoaded", carregarUsuariosPendentes);

async function carregarUsuariosPendentes() {
  const tipo = filtroTipo.value;
 let endpoint = "https://conexao-alimentar.onrender.com/admin/usuarios/pendentes";

 if (tipo !== "todos") {
  endpoint += `/${tiposMap[tipo]}`; 
 }

  console.log("Carregando pendentes de:", tipo, "Endpoint:", endpoint);

  try {
    const resposta = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!resposta.ok) {
      console.error("Erro ao carregar usuários pendentes:", resposta.status);
      tabela.innerHTML = `<tr><td colspan="4" class="px-4 py-4 text-center text-red-500">Erro ao carregar dados.</td></tr>`;
      toastError("Erro ao carregar usuários pendentes.");
      return;
    }

    const usuarios = await resposta.json();
    tabela.innerHTML = "";

    if (usuarios.length === 0) {
      tabela.innerHTML = `<tr><td colspan="4" class="px-4 py-4 text-center text-gray-500">Nenhum usuário pendente encontrado.</td></tr>`;
      toastInfo("Nenhum usuário pendente encontrado.");
      return;
    }

    usuarios.forEach(usuario => {
      const linha = document.createElement("tr");

      linha.innerHTML = `
        <td class="px-4 py-3">${usuario.nome || usuario.nomeFantasia || "-"}</td>
        <td class="px-4 py-3">${formatarTipo(usuario.tipoUsuario)}</td>
        <td class="px-4 py-3">${usuario.email || "-"}</td>
        <td class="px-4 py-3 flex flex-wrap gap-2">
          <button onclick="verPerfil(${usuario.id}, '${usuario.tipoUsuario}')" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-sm">
            Visualizar
          </button>
          <button onclick="aprovarUsuario(${usuario.id})" class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-sm">
            Aprovar
          </button>
          <button onclick="abrirModalReprovacao(${usuario.id})" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm">
            Reprovar
          </button>
        </td>
      `;

      tabela.appendChild(linha);
    });

    toastSuccess("Usuários carregados com sucesso!");
  } catch (erro) {
    console.error("Erro:", erro);
    tabela.innerHTML = `<tr><td colspan="4" class="px-4 py-4 text-center text-red-500">Erro ao carregar dados.</td></tr>`;
    toastError("Erro ao se comunicar com o servidor.");
  }
}

function verPerfil(id, tipo) {
  window.location.href = `/pages/administrador/perfil-usuario.html?id=${id}&tipo=${tipo}`;
}

async function aprovarUsuario(id) {
  try {
    const resposta = await fetch(`https://conexao-alimentar.onrender.com/admin/usuarios/aprovar/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (resposta.ok) {
      toastSuccess("Usuário aprovado com sucesso!");
      carregarUsuariosPendentes();
    } else {
      toastError("Erro ao aprovar usuário.");
    }
  } catch (erro) {
    console.error("Erro:", erro);
    toastError("Erro ao se comunicar com o servidor.");
  }
}

let idUsuarioParaReprovar = null;

function abrirModalReprovacao(id) {
  idUsuarioParaReprovar = id;
  document.getElementById("inputJustificativa").value = "";
  document.getElementById("modalJustificativa")?.classList.remove("hidden");
}

function fecharModal() {
  document.getElementById("modalJustificativa")?.classList.add("hidden");
  idUsuarioParaReprovar = null;
}

document.getElementById("btnConfirmarReprovar")?.addEventListener("click", async () => {
  const justificativa = document.getElementById("inputJustificativa").value;

  if (!justificativa.trim()) {
    toastError("Por favor, informe a justificativa.");
    return;
  }

  try {
    const resposta = await fetch(`https://conexao-alimentar.onrender.com/admin/usuarios/reprovar/${idUsuarioParaReprovar}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ motivo: justificativa })
    });

    if (resposta.ok) {
      toastSuccess("Usuário reprovado com sucesso!");
      setTimeout(() => {
        window.location.href = "/pages/administrador/usuarios-reprovados.html";
      }, 1200);
    } else {
      toastError("Erro ao reprovar usuário.");
    }
  } catch (erro) {
    console.error("Erro:", erro);
    toastError("Erro ao se comunicar com o servidor.");
  } finally {
    fecharModal();
  }
});

document.getElementById("btnCancelarReprovar")?.addEventListener("click", fecharModal);
