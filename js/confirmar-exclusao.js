document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const info = document.getElementById("infoDoacao");
  const btn = document.getElementById("btnConfirmar");
  const token = localStorage.getItem("token");

  if (!id || !token) {
    alert("Requisição inválida.");
    window.location.href = "/pages/doacao/minhas-doacoes.html";
    return;
  }

  try {
    const response = await fetch(`https://conexao-alimentar.onrender.com/doacoes/${id}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!response.ok) throw new Error("Erro ao buscar doação.");

    const doacao = await response.json();
    info.textContent = `Tem certeza que deseja excluir a doação "${doacao.nomeAlimento}"?`;
  } catch (e) {
    info.textContent = "Erro ao carregar dados da doação.";
    console.error(e);
  }

  btn.addEventListener("click", async () => {
    const confirmado = confirm("Essa ação não poderá ser desfeita. Deseja continuar?");
    if (!confirmado) return;

    try {
      const deleteResp = await fetch(`https://conexao-alimentar.onrender.com/doacoes/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + token
        }
      });

      if (!deleteResp.ok) throw new Error("Erro ao excluir doação.");

      alert("Doação excluída com sucesso.");
      window.location.href = "/pages/doacao/minhas-doacoes.html";
    } catch (e) {
      console.error(e);
      alert("Erro ao excluir doação.");
    }
  });
});
