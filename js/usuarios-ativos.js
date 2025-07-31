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

const filtroTipo = document.getElementById("filtroTipoAtivo");
const tabela = document.getElementById("tabelaAtivos");

filtroTipo.addEventListener("change", carregarUsuariosAtivos);
document.addEventListener("DOMContentLoaded", carregarUsuariosAtivos);

async function carregarUsuariosAtivos() {
  const tipo = filtroTipo.value;
  let endpoint = "http://localhost:8080/admin/usuarios/ativos";

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
          <button onclick="verPerfil(${usuario.id})" class="text-red-600 hover:underline font-semibold">
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
    case "COMERCIO": return "Comércio";
    case "ONG": return "ONG";
    case "PESSOA_FISICA": return "Pessoa Física";
    case "PRODUTOR_RURAL": return "Produtor Rural";
    case "VOLUNTARIO": return "Voluntário";
    default: return tipo;
  }
}

function verPerfil(id) {
  window.location.href = `/pages/doador/Administrador/perfil-usuario.html?id=${id}`;
}
