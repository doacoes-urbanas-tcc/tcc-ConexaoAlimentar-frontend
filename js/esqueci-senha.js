document.getElementById("form-esqueci").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const mensagem = document.getElementById("mensagem");

  try {
    const response = await fetch("https://conexao-alimentar.onrender.com/auth/recuperar-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    if (response.ok) {
      mensagem.textContent = "Um link de redefinição foi enviado para seu e-mail.";
      mensagem.classList.remove("text-red-500");
      mensagem.classList.add("text-green-600");
    } else {
      mensagem.textContent = "Não foi possível enviar o e-mail. Verifique se está correto.";
      mensagem.classList.add("text-red-500");
    }
  } catch (err) {
    mensagem.textContent = "Erro na solicitação. Tente novamente.";
    mensagem.classList.add("text-red-500");
  }
});
