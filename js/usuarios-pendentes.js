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

  function carregarUsuarios(tipo) {
    let endpoint = tipo === "todos"
      ? "/admin/usuarios/pendentes"
      : `/admin/usuarios/pendentes/${tipo}`;

    fetch(`http://localhost:8080${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar usuários");
        return res.json();
      })
      .then((dados) => preencherTabela(dados, tipo))
      .catch((err) => console.error(err));
  }

  function preencherTabela(usuarios, tipoSelecionado) {
    tabela.innerHTML = "";
    usuarios.forEach((usuario) => {
      const tr = document.createElement("tr");

      const tdNome = document.createElement("td");
      tdNome.textContent = usuario.nome || usuario.nomeFantasia || "-";
      tdNome.className = "px-4 py-2";

      const tdTipo = document.createElement("td");
      tdTipo.textContent = tipoSelecionado === "todos" ? usuario.tipoUsuario || "-" : tipoSelecionado;
      tdTipo.className = "px-4 py-2";

      const tdEmail = document.createElement("td");
      tdEmail.textContent = usuario.email || "-";
      tdEmail.className = "px-4 py-2";

      const tdAcoes = document.createElement("td");
      tdAcoes.className = "px-4 py-2 flex flex-wrap gap-2";

      const btnVer = document.createElement("button");
      btnVer.textContent = "Visualizar";
      btnVer.className = "bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-sm";
      btnVer.onclick = () => {
        window.location.href = `/admin/usuarios/perfil.html?id=${usuario.id}&tipo=${tipoSelecionado}`;
      };

      const btnAprovar = document.createElement("button");
      btnAprovar.textContent = "Aprovar";
      btnAprovar.className = "bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-sm";
      btnAprovar.onclick = () => aprovarUsuario(usuario.id);

      const btnReprovar = document.createElement("button");
      btnReprovar.textContent = "Reprovar";
      btnReprovar.className = "bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm";
      btnReprovar.onclick = () => reprovarUsuario(usuario.id);

      tdAcoes.append(btnVer, btnAprovar, btnReprovar);
      tr.append(tdNome, tdTipo, tdEmail, tdAcoes);
      tabela.appendChild(tr);
    });
  }

  function aprovarUsuario(id) {
    fetch(`http://localhost:8080/admin/usuarios/aprovar/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) carregarUsuarios(filtro.value);
        else alert("Erro ao aprovar usuário");
      });
  }

  function reprovarUsuario(id) {
    fetch(`http://localhost:8080/admin/usuarios/reprovar/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) carregarUsuarios(filtro.value);
        else alert("Erro ao reprovar usuário");
      });
  }

  carregarUsuarios("todos");
});
