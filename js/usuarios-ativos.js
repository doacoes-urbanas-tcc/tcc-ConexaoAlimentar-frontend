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
const tabela = document.getElementById("tabelaAtivos");
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

filtroTipo.addEventListener("change", carregarUsuariosAtivos);
document.addEventListener("DOMContentLoaded", carregarUsuariosAtivos);

async function carregarUsuariosAtivos() {
  const tipo = filtroTipo.value;
  let endpoint = "https://conexao-alimentar.onrender.com/admin/usuarios/ativos";

  if (tipo !== "todos") {
    endpoint += `/${tiposMap[tipo]}`;
  }

  console.log("Carregando ativos de:", tipo, "Endpoint:", endpoint);

  try {
    const resposta = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!resposta.ok) {
      if (resposta.status === 403) {
        toastError("Acesso negado. Seu usuário não tem permissão.");
      } else {
        toastError(`Erro ao carregar usuários ativos: ${resposta.status}`);
      }
      tabela.innerHTML = `<tr><td colspan="4" class="px-4 py-4 text-center text-red-500">Erro ao carregar dados.</td></tr>`;
      return;
    }

    const usuarios = await resposta.json();
    tabela.innerHTML = "";

    if (usuarios.length === 0) {
      tabela.innerHTML = `<tr><td colspan="4" class="px-4 py-4 text-center text-gray-500">Nenhum usuário encontrado.</td></tr>`;
      toastInfo("Nenhum usuário ativo encontrado.");
      return;
    }

    usuarios.forEach(usuario => {
      const linha = document.createElement("tr");

      linha.innerHTML = `
        <td class="px-4 py-3">${usuario.nome || usuario.nomeFantasia || "-"}</td>
        <td class="px-4 py-3">${formatarTipo(usuario.tipoUsuario)}</td>
        <td class="px-4 py-3">${usuario.email || "-"}</td>
        <td class="px-4 py-3">
          <button onclick="verPerfil(${usuario.id}, '${usuario.tipoUsuario}')" class="text-blue-600 hover:underline font-semibold">
            Ver Perfil
          </button>
        </td>
      `;

      tabela.appendChild(linha);
    });

    toastSuccess("Usuários ativos carregados com sucesso!");
  } catch (erro) {
    console.error("Erro:", erro);
    tabela.innerHTML = `<tr><td colspan="4" class="px-4 py-4 text-center text-red-500">Erro ao carregar dados.</td></tr>`;
    toastError("Erro ao se comunicar com o servidor.");
  }
}

function verPerfil(id, tipo) {
  window.location.href = `/pages/administrador/perfil-usuario.html?id=${id}&tipo=${tipo}`;
}
