document.getElementById("form-login").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const erro = document.getElementById("erro");

  try {
    const resposta = await fetch("https://conexao-alimentar.onrender.com/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    });

    if (!resposta.ok) {
      erro.classList.remove("hidden");
      return;
    }

    const dados = await resposta.json();

    localStorage.setItem("token", dados.token);
    localStorage.setItem("usuarioId", dados.usuarioId);
    localStorage.setItem("tipoUsuario", dados.tipoUsuario);

    switch (dados.tipoUsuario) {
      case "ONG":
        window.location.href = "/pages/ong/home-page-ong.html";
        break;
      case "COMERCIO":
        window.location.href = "/pages/doador/home-page-doador.html";
        break;
      case "PRODUTOR_RURAL":
        window.location.href = "/pages/doador/home-page-doador.html";
        break;
      case "PESSOA_FISICA":
        window.location.href = "/pages/doador/home-page-doador.html";
        break;
      case "ADMIN":
        window.location.href = "/pages/administrador/dashboard-administrador.html";
        break
      case "VOLUNTARIO":
        window.location.href = "/pages/voluntario/home-page-voluntario.html";
        break
      default:
        window.location.href = "/pages/cadastrologin/cadastro.html"; 
    }
  } catch (err) {
    console.error("Erro no login:", err);
    erro.classList.remove("hidden");
  }
});
