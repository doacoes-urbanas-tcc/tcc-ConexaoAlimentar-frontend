document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const idDoacao = params.get("id");
  const infoDoacao = document.getElementById("info-doacao");
  const btnConfirmar = document.getElementById("btnConfirmar");
  const token = localStorage.getItem("token");
  let doacao = null;

  if (!idDoacao || !token) {
    showError("ID de doação inválido ou usuário não está logado.");
    window.location.href = "/pages/doacao/lista-doacoes.html";
    return;
  }

  try {
    const response = await fetch(`https://conexao-alimentar.onrender.com/doacoes/${idDoacao}`, {
      headers: { "Authorization": "Bearer " + token }
    });

    if (!response.ok) throw new Error("Erro ao buscar dados da doação.");
    doacao = await response.json();

    infoDoacao.innerHTML = `
      <h3 class="text-xl font-semibold text-red-600">${doacao.nomeAlimento}</h3>
      <p class="text-gray-700">${doacao.descricao}</p>
      <p><strong>Categoria:</strong> ${doacao.categoria}</p>
      <p><strong>Quantidade:</strong> ${doacao.quantidade} ${doacao.unidadeMedida}</p>
      <p><strong>Validade:</strong> ${formatarData(doacao.dataValidade)}</p>
      <p><strong>Data de Cadastro:</strong> ${formatarDataHora(doacao.dataCadastro)}</p>
    `;
  } catch (err) {
    console.error(err);
    infoDoacao.innerHTML = "<p class='text-red-600'>Erro ao carregar dados da doação.</p>";
  }

  btnConfirmar.addEventListener("click", async () => {
    try {
      const response = await fetch("https://conexao-alimentar.onrender.com/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ doacaoId: idDoacao })
      });

      if (!response.ok) {
        const erro = await response.text();
        showError("Erro ao reservar: " + erro);
        return;
      }

      localStorage.setItem("dadosDoacao", JSON.stringify(doacao));
      window.location.href = `/pages/reserva/qrcode.html?id=${idDoacao}`;
    } catch {
      showError("Erro ao tentar reservar a doação.");
    }
  });
});

function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR");
}

function formatarDataHora(dataHora) {
  return new Date(dataHora).toLocaleString("pt-BR");
}
