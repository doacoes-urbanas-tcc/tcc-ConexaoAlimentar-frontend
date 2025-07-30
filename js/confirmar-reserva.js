document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const idDoacao = params.get("id"); 
  const infoDoacao = document.getElementById("info-doacao");
  const btnConfirmar = document.getElementById("btnConfirmar");
  const token = localStorage.getItem("token");

  if (!idDoacao || !token) {
    alert("ID de doação inválido ou usuário não está logado.");
    window.location.href = "/pages/doacao/lista-doacoes.html";
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/doacoes/${idDoacao}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar dados da doação.");
    }

    const doacao = await response.json();

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
      const response = await fetch("http://localhost:8080/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ doacaoId: idDoacao })
      });

      if (!response.ok) {
        const erro = await response.text();
        alert("Erro ao reservar: " + erro);
        return;
      }

      window.location.href = `/pages/reserva/qrcode.html?id=${idDoacao}`;
    } catch (err) {
      alert("Erro ao tentar reservar a doação.");
    }
  });
});

function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR");
}

function formatarDataHora(dataHora) {
  return new Date(dataHora).toLocaleString("pt-BR");
}
