document.getElementById("form-login").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const erro = document.getElementById("erro");

  try {
    const resposta = await fetch("http://localhost:8080/auth/login", {
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
        window.location.href = "/pages/doacao/lista-doacoes.html";
        break;
      case "COMERCIO":
        window.location.href = "/pages/doacao/cadastro-doacao.html";
        break;
      case "PRODUTOR_RURAL":
        window.location.href = "/pages/produtor/home.html";
        break;
      case "PESSOA_FISICA":
        window.location.href = "/pages/voluntario/home.html";
        break;
      case "ADMIN":
        window.location.href = "/pages/administrador/administrador.html";
        break
      default:
        window.location.href = "/pages/home.html"; 
    }
  } catch (err) {
    console.error("Erro no login:", err);
    erro.classList.remove("hidden");
  }
});
