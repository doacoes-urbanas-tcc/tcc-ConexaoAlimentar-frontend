document.getElementById("form-login").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  const modalErro = document.getElementById("modal-erro");
  const mensagemErro = document.getElementById("mensagem-erro");
  const fecharModal = document.getElementById("fechar-modal");

  const mostrarModalErro = (mensagem) => {
    mensagemErro.textContent = mensagem;
    modalErro.classList.remove("hidden");
    modalErro.classList.add("flex"); 
  };

  const fecharModalErro = () => {
    modalErro.classList.add("hidden");
    modalErro.classList.remove("flex");
  };

  fecharModal.addEventListener("click", fecharModalErro);

  try {
    await fetch("https://conexao-alimentar.onrender.com/actuator/health", { method: "GET" });

    const resposta = await fetch("https://conexao-alimentar.onrender.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    if (resposta.status === 403) {
      mostrarModalErro("Acesso negado. Verifique seu e-mail e senha.");
      return;
    }

    if (!resposta.ok) {
      mostrarModalErro("Falha no login. Tente novamente.");
      return;
    }

    const dados = await resposta.json();

    localStorage.setItem("token", dados.token);
    localStorage.setItem("usuarioId", dados.usuarioId);
    localStorage.setItem("tipoUsuario", dados.tipoUsuario);

    await new Promise(r => setTimeout(r, 100));

    switch (dados.tipoUsuario) {
      case "ONG":
        window.location.href = "/pages/reserva/minhas-reservas";
        break;
      case "COMERCIO":
      case "PRODUTOR_RURAL":
      case "PESSOA_FISICA":
        window.location.href = "/pages/doador/home-page-doador.html";
        break;
      case "ADMIN":
        window.location.href = "/pages/administrador/dashboard-administrador.html";
        break;
      case "VOLUNTARIO":
        window.location.href = "/pages/voluntario/home-page-voluntario.html";
        break;
      default:
        window.location.href = "/pages/cadastrologin/cadastro.html"; 
    }

  } catch (err) {
    console.error("Erro no login:", err);
    mostrarModalErro("Erro de conexão com o servidor. Tente novamente em alguns segundos.");
  }
});
