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

document.addEventListener("DOMContentLoaded", () => {
  const filtro = document.getElementById("filtroTipo");
  const tabela = document.getElementById("tabelaUsuarios");
  const token = localStorage.getItem("token");

  filtro.addEventListener("change", () => carregarUsuarios(filtro.value));

  function carregarUsuarios(tipoSelecionado) {
    const tipo = tiposMap[tipoSelecionado] || null;

    fetch(`https://conexao-alimentar.onrender.com/admin/usuarios/reprovados`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao carregar usuários reprovados");
        return res.json();
      })
      .then(usuarios => {
        console.log("Usuários reprovados recebidos:", usuarios);
        console.log("Primeiro usuário:", usuarios[0]);
        if (tipo) {
          usuarios = usuarios.filter(u => u.tipoUsuario === tipo);
        }
        preencherTabela(usuarios);
      })
      .catch(err => {
        console.error("Erro:", err);
        alert("Erro ao buscar usuários reprovados");
      });
  }

  function preencherTabela(usuarios) {
    tabela.innerHTML = "";

    usuarios.forEach(usuario => {
      const tr = document.createElement("tr");

      const tdNome = document.createElement("td");
      tdNome.textContent = usuario.nome || usuario.nomeFantasia || "-";
      tdNome.className = "px-4 py-2";

      const tdTipo = document.createElement("td");
      tdTipo.textContent = formatarTipo(usuario.tipoUsuario);
      tdTipo.className = "px-4 py-2";

      const tdEmail = document.createElement("td");
      tdEmail.textContent = usuario.email || "-";
      tdEmail.className = "px-4 py-2";

      const tdJustificativa = document.createElement("td");
      tdJustificativa.textContent = usuario.justificativaReprovacao || "Não informada";
      tdJustificativa.className = "px-4 py-2 text-gray-700";

      tr.append(tdNome, tdTipo, tdEmail, tdJustificativa);
      tabela.appendChild(tr);
    });
  }

  carregarUsuarios("todos");
});
