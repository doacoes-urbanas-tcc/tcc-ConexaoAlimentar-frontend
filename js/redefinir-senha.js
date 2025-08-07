document.getElementById("form-redefinir").addEventListener("submit", async (e) => {
  e.preventDefault();

  const senha = document.getElementById("senha").value;
  const confirmar = document.getElementById("confirmarSenha").value;
  const mensagem = document.getElementById("mensagem");
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  if (!token) {
    mensagem.textContent = "Token inválido ou ausente.";
    mensagem.classList.add("text-red-500");
    return;
  }

  if (senha !== confirmar) {
    mensagem.textContent = "As senhas não coincidem.";
    mensagem.classList.add("text-red-500");
    return;
  }

  try {
    const response = await fetch("https://conexao-alimentar.onrender.com/auth/recuperar-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, novaSenha: senha })
    });

    if (response.ok) {
      mensagem.textContent = "Senha redefinida com sucesso. Redirecionando...";
      mensagem.classList.remove("text-red-500");
      mensagem.classList.add("text-green-600");
      setTimeout(() => {
        window.location.href = "../cadastrologin/login.html";
      }, 2500);
    } else {
      const msg = await response.text();
      mensagem.textContent = msg || "Erro ao redefinir a senha.";
      mensagem.classList.add("text-red-500");
    }
  } catch (err) {
    mensagem.textContent = "Erro na solicitação.";
    mensagem.classList.add("text-red-500");
  }
});
