const filtroTipo = document.getElementById("filtroTipoAtivo");
const tabela = document.getElementById("tabelaAtivos");

filtroTipo.addEventListener("change", carregarUsuariosAtivos);
document.addEventListener("DOMContentLoaded", carregarUsuariosAtivos);

async function carregarUsuariosAtivos() {
  const tipo = filtroTipo.value;
  let endpoint = "https://conexao-alimentar.onrender.com/admin/usuarios/ativos";

  if (tipo !== "todos") {
    endpoint += `/${tipo}`;
  }

  const token = localStorage.getItem("token");

  try {
    const resposta = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!resposta.ok) {
      console.error("Erro ao carregar usuários ativos");
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
  } catch (erro) {
    console.error("Erro:", erro);
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
