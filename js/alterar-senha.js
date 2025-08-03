document.getElementById("form-alterar-senha").addEventListener("submit", async (e) => {
  e.preventDefault();

  const senhaAtual = document.getElementById("senhaAtual").value;
  const novaSenha = document.getElementById("novaSenha").value;
  const confirmar = document.getElementById("confirmarNovaSenha").value;
  const mensagem = document.getElementById("mensagem");

  if (novaSenha !== confirmar) {
    mensagem.textContent = "As senhas não coincidem.";
    mensagem.classList.add("text-red-500");
    return;
  }

  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("usuarioId");
  const tipoUsuario = localStorage.getItem("tipoUsuario")?.toLowerCase(); 

  if (!tipoUsuario || !usuarioId || !token) {
    mensagem.textContent = "Erro de autenticação. Faça login novamente.";
    mensagem.classList.add("text-red-500");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/${tipoUsuario}/${usuarioId}/senha`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ senhaAtual, novaSenha }),
    });

    if (response.ok) {
      mensagem.textContent = "Senha atualizada com sucesso!";
      mensagem.classList.remove("text-red-500");
      mensagem.classList.add("text-green-600");
      window.location.href = "/pages/cadastrologin/login.html";
    } else {
      const msg = await response.text();
      mensagem.textContent = msg || "Erro ao atualizar senha.";
      mensagem.classList.add("text-red-500");
    }
  } catch (err) {
    mensagem.textContent = "Erro na solicitação.";
    mensagem.classList.add("text-red-500");
  }
});
