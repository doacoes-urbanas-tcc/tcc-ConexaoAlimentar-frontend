document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-alterar-email");
  const mensagem = document.getElementById("mensagem");

  const token = localStorage.getItem("token");
  const tipo = localStorage.getItem("tipo"); 
  const id = localStorage.getItem("id");

  if (!token || !tipo || !id) {
    mensagem.textContent = "Usuário não autenticado.";
    mensagem.classList.add("text-red-500");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const novoEmail = form.novoEmail.value;

    fetch(`http://localhost:8080/${tipo}/${id}/email`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ novoEmail })
    })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao atualizar e-mail");
      mensagem.textContent = "E-mail atualizado com sucesso!";
      mensagem.classList.remove("text-red-500");
      mensagem.classList.add("text-green-600");
      form.reset();
    })
    .catch(err => {
      mensagem.textContent = "Erro ao atualizar e-mail. Verifique e tente novamente.";
      mensagem.classList.remove("text-green-600");
      mensagem.classList.add("text-red-500");
    });
  });
});
