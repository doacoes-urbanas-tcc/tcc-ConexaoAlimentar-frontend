'use strict';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-login");

  form?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email")?.value.trim();
    const senha = document.getElementById("senha")?.value.trim();

    if (!email || !senha) {
      toastError("Por favor, preencha todos os campos.");
      return;
    }

    try {

      const resposta = await fetch("https://conexao-alimentar.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (resposta.status === 403) {
        toastError("Acesso negado. Verifique seu e-mail e senha.");
        return;
      }

      if (!resposta.ok) {
        toastError("Falha no login. Tente novamente.");
        return;
      }

      const dados = await resposta.json();

      localStorage.setItem("token", dados.token);
      localStorage.setItem("usuarioId", dados.usuarioId);
      localStorage.setItem("tipoUsuario", dados.tipoUsuario);

      toastSuccess("Login realizado com sucesso!");

      setTimeout(() => {
        switch (dados.tipoUsuario) {
          case "ONG":
            window.location.href = "/pages/ong/home-page-ong.html";
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
      }, 1200);

    } catch (err) {
      console.error("Erro no login:", err);
      toastError("Erro de conexão com o servidor. Tente novamente em alguns segundos.");
    }
  });
});
