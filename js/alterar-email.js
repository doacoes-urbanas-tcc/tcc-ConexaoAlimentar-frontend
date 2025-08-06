document.getElementById("form-alterar-email").addEventListener("submit", async (e) => {
  e.preventDefault();

  const novoEmail = document.getElementById("novoEmail").value;
  const mensagem = document.getElementById("mensagem");

  const tipoUsuario = localStorage.getItem("tipoUsuario").toLowerCase();
  const usuarioId = localStorage.getItem("usuarioId");
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`https://conexao-alimentar.onrender.com/${tipoUsuario}/${usuarioId}/email`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ novoEmail }),
    });

    const texto = await response.text();

    if (response.ok) {
      mensagem.textContent = texto;
      mensagem.className = "text-green-600";
    } else {
      mensagem.textContent = texto || "Erro ao atualizar e-mail.";
      mensagem.className = "text-red-500";
    }
  } catch (err) {
    mensagem.textContent = "Erro ao conectar ao servidor.";
    mensagem.className = "text-red-500";
  }
});
