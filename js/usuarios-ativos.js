const filtroTipo = document.getElementById("filtroTipoAtivo");
const tabela = document.getElementById("tabelaAtivos");

const tiposMap = {
  "comercios": "COMERCIO",
  "ongs": "ONG",
  "pessoas-fisicas": "PESSOA_FISICA",
  "produtores-rurais": "PRODUTOR_RURAL",
  "voluntarios": "VOLUNTARIO"
};

filtroTipo.addEventListener("change", carregarUsuariosAtivos);
document.addEventListener("DOMContentLoaded", carregarUsuariosAtivos);

async function carregarUsuariosAtivos() {
  const tipo = filtroTipo.value;
  let endpoint = "https://conexao-alimentar.onrender.com/admin/usuarios/ativos";

  if (tipo !== "todos") {
    endpoint += `/${tiposMap[tipo]}`;
  }

  const token = localStorage.getItem("token");

  try {
    const resposta = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!resposta.ok) {
      toastError("Erro ao carregar usuários ativos");
      return;
    }

    const usuarios = await resposta.json();
    tabela.innerHTML = "";

    if (usuarios.length === 0) {
      tabela.innerHTML = `<tr><td colspan="4" class="px-4 py-4 text-center text-gray-500">Nenhum usuário encontrado.</td></tr>`;
      return;
    }

    usuarios.forEach(usuario => {
      const linha = document.createElement("tr");

      linha.innerHTML = `
        <td class="px-4 py-3">${usuario.nome || usuario.nomeFantasia || "Sem nome"}</td>
        <td class="px-4 py-3">${formatarTipo(usuario.tipoUsuario)}</td>
        <td class="px-4 py-3">${usuario.email}</td>
        <td class="px-4 py-3">
          <button onclick="verPerfil(${usuario.id}, '${usuario.tipoUsuario}')" class="text-red-600 hover:underline font-semibold">
            Ver Perfil
          </button>
        </td>
      `;

      tabela.appendChild(linha);
    });

    toastSuccess("Usuários carregados com sucesso!");
  } catch (erro) {
    console.error("Erro:", erro);
    toastError("Erro ao buscar usuários.");
  }
}

function formatarTipo(tipo) {
  switch (tipo) {
    case "COMERCIO": return "COMERCIO";
    case "ONG": return "ONG";
    case "PESSOA_FISICA": return "PESSOA_FISICA";
    case "PRODUTOR_RURAL": return "PRODUTOR_RURAL";
    case "VOLUNTARIO": return "VOLUNTARIO";
    default: return tipo;
  }
}

function verPerfil(id, tipo) {
  window.location.href = `/pages/administrador/perfil-usuario.html?id=${id}&tipo=${tipo}`;
}

'use strict';

function toastSuccess(message) {
  showToast(message, "bg-green-500");
}

function toastError(message) {
  showToast(message, "bg-red-500");
}

function showToast(message, bgColor) {
  const containerId = "toast-container";
  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.className = "fixed top-4 right-4 z-50 space-y-2";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `${bgColor} text-white px-4 py-2 rounded shadow-md transition-opacity duration-300 opacity-100`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
