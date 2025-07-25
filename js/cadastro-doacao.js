document.addEventListener("DOMContentLoaded", function () {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("dataValidade").setAttribute("min", today);

  const form = document.querySelector("form");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado para cadastrar uma doação.");
      return;
    }

    const nomeAlimento = document.getElementById("nomeAlimento").value;
    const unidadeMedida = document.getElementById("unidadeMedida").value;
    const quantidade = parseFloat(document.getElementById("quantidade").value);
    const dataValidade = document.getElementById("dataValidade").value;
    const descricao = document.getElementById("descricao").value;
    const categoria = document.getElementById("categoria").value;
    const imagemFile = document.getElementById("urlImagem").files[0];

    if (!imagemFile) {
      alert("Por favor, selecione uma imagem.");
      return;
    }

    const dto = {
      nomeAlimento,
      unidadeMedida,
      quantidade,
      dataValidade,
      descricao,
      categoria
    };

    const formData = new FormData();
    formData.append("dto", new Blob([JSON.stringify(dto)], { type: "application/json" }));
    formData.append("file", imagemFile);

    try {
      const response = await fetch("http://localhost:8080/doacoes/cadastrar", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token
        },
        body: formData
      });

      const text = await response.text();

      if (response.ok) {
        alert("✅ " + text);
        form.reset();
      } else {
        alert("❌ Erro: " + text);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao cadastrar a doação.");
    }
  });
});
