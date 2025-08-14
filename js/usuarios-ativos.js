const filtroTipo = document.getElementById("filtroTipoAtivo");
const tabela = document.getElementById("tabelaAtivos");

filtroTipo.addEventListener("change", carregarUsuariosAtivos);
document.addEventListener("DOMContentLoaded", carregarUsuariosAtivos);

function mapearTipoParaBackend(valor) {
  switch (valor) {
    case "todos": return "todos";
    case "comercios": return "COMERCIO";
    case "ongs": return "ONG";
    case "pessoas-fisicas": return "PESSOA_FISICA";
    case "produtores-rurais": return "PRODUTOR_RURAL";
    case "voluntarios": return "VOLUNTARIO";
    default: return valor; // fallback caso já venha certo
  }
}

async function carregarUsuariosAtivos() {
  const tipoSelecionado = filtroTipo.value;
  const tipoBackend = mapearTipoParaBackend(tipoSelecionado);

  let endpoint = "https://conexao-alimentar.onrender.com/admin/usuarios/ativos";

  if (tipoBackend !== "todos") {
    endpoint += `/${tipoBackend}`;
  }

  console.log("Carregando ativos de:", tipoSelecionado, "Endpoint:", endpoint);

  const token = localStorage.getItem("token");

  try {
    const resposta = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!resposta.ok) {
      if (resposta.status === 403) {
        toastError("Acesso negado. Seu usuário não tem permissão.");
      } else {
        toastError(`Erro ao carregar usuários ativos: ${resposta.status}`);
      }
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

function toastSuccess(message) {
  showToast(message, "bg-green-500");
}

function toastError(message) {
  showToast(message, "bg-red-500");
}

function showToast(message, bgColor) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `${bgColor} text-white px-4 py-2 rounded shadow mb-2 animate-fade-in`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("animate-fade-out");
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}
