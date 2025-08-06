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
  let idUsuarioParaReprovar = null;

  filtro.addEventListener("change", () => carregarUsuarios(filtro.value));

  function carregarUsuarios(tipo) {
    let endpoint = tipo === "todos"
      ? "/admin/usuarios/pendentes"
      : `/admin/usuarios/pendentes/${tipo}`;

    fetch(`https://conexao-alimentar.onrender.com${endpoint}`, {
      headers: { 
        Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar usuários");
        return res.json();
      })
      .then((dados) => preencherTabela(dados))
      .catch((err) => console.error(err));
  }

  function preencherTabela(usuarios) {
    tabela.innerHTML = "";
    usuarios.forEach((usuario) => {
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

      const tdAcoes = document.createElement("td");
      tdAcoes.className = "px-4 py-2 flex flex-wrap gap-2";

      const btnVer = document.createElement("button");
      btnVer.textContent = "Visualizar";
      btnVer.className = "bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-sm";
      btnVer.onclick = () => {
        window.location.href = `/pages/administrador/perfil-usuario.html?id=${usuario.id}&tipo=${usuario.tipoUsuario}`;
      };

      const btnAprovar = document.createElement("button");
      btnAprovar.textContent = "Aprovar";
      btnAprovar.className = "bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-sm";
      btnAprovar.onclick = () => aprovarUsuario(usuario.id);

      const btnReprovar = document.createElement("button");
      btnReprovar.textContent = "Reprovar";
      btnReprovar.className = "bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm";
      btnReprovar.onclick = () => abrirModalReprovacao(usuario.id);

      tdAcoes.append(btnVer, btnAprovar, btnReprovar);
      tr.append(tdNome, tdTipo, tdEmail, tdAcoes);
      tabela.appendChild(tr);
    });
  }

  function aprovarUsuario(id) {
    fetch(`https://conexao-alimentar.onrender.com/admin/usuarios/aprovar/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) carregarUsuarios(filtro.value);
        else alert("Erro ao aprovar usuário");
      });
  }

  function abrirModalReprovacao(id) {
    idUsuarioParaReprovar = id;
    document.getElementById("inputJustificativa").value = "";
    document.getElementById("modalJustificativa").classList.remove("hidden");
  }

  function fecharModal() {
    document.getElementById("modalJustificativa").classList.add("hidden");
    idUsuarioParaReprovar = null;
  }

  document.getElementById("btnConfirmarReprovar").addEventListener("click", () => {
    const justificativa = document.getElementById("inputJustificativa").value;

    if (!justificativa.trim()) {
      alert("Por favor, informe a justificativa.");
      return;
    }

    fetch(`https://conexao-alimentar.onrender.com/admin/usuarios/reprovar/${idUsuarioParaReprovar}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ motivo: justificativa })
    })
      .then(res => {
        if (res.ok) {
          alert("Usuário reprovado com sucesso!");
          window.location.href = "/pages/administrador/usuarios-reprovados.html";
        } else {
          return res.text().then(msg => {
            console.error("Erro:", msg);
            alert("Erro ao reprovar usuário.");
          });
        }
      })
      .catch(err => {
        console.error("Erro de rede:", err);
        alert("Erro ao se comunicar com o servidor.");
      })
      .finally(() => fecharModal());
  });

  document.getElementById("btnCancelarReprovar").addEventListener("click", fecharModal);

  carregarUsuarios("todos");
});
