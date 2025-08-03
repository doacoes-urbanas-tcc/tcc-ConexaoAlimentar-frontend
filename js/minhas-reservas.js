document.addEventListener("DOMContentLoaded", async () => {
  const lista = document.getElementById("lista-reservas");
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa estar logado.");
    window.location.href = "/pages/cadastrologin/login.html";
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/reservas/minhas-reservas", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar reservas.");
    }

    const reservas = await response.json();

    if (reservas.length === 0) {
      lista.innerHTML = `<p class="text-gray-600">Você ainda não possui reservas.</p>`;
      return;
    }

    reservas.forEach(reserva => {
  const card = document.createElement("div");
  card.className = "bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-4";

  const status = reserva.status.replace("_", " ");
  const dataExpiracao = reserva.dataExpiracao ? new Date(reserva.dataExpiracao) : null;
  const agora = new Date();

  const podeVerQRCode = reserva.status === "RESERVADA" && agora < dataExpiracao;

  card.innerHTML = `
    <img src="${reserva.urlImagem}" alt="${reserva.nomeAlimento}" class="w-full md:w-48 h-48 object-cover rounded-lg">
    <div class="flex-1">
      <h3 class="text-xl font-semibold text-red-600">${reserva.nomeAlimento}</h3>
      <p class="text-gray-700 mb-2">${reserva.descricao || "Sem descrição."}</p>
      <div class="text-sm text-gray-600 space-y-1 mb-3">
        <p><strong>Categoria:</strong> ${reserva.categoria}</p>
        <p><strong>Quantidade:</strong> ${reserva.quantidade} ${reserva.unidadeMedida.toLowerCase()}</p>
        <p><strong>Validade:</strong> ${formatarData(reserva.dataValidade)}</p>
        <p><strong>Doador:</strong> ${reserva.doadorNome}</p>
        <p><strong>Status:</strong> ${status}</p>
       <p><strong>Expira em:</strong> ${dataExpiracao ? formatarDataHora(dataExpiracao) : "Não disponível"}</p>
      </div>
      <div class="flex flex-wrap gap-2 mt-2">
        ${podeVerQRCode 
          ? `<a href="/pages/reserva/qrcode.html?id=${reserva.id}" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Ver QR Code</a>` 
          : `<span class="text-sm text-red-600 font-semibold">QR Code expirado</span>`}
        <a href="/pages/administrador/perfil-usuario.html?id=${reserva.doadorId}&tipo=${reserva.doadorTipo}" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
          Ver Perfil do doador
        </a>
      </div>
    </div>
  `;

  lista.appendChild(card);
});

  } catch (err) {
    console.error(err);
    lista.innerHTML = `<p class="text-red-600">Erro ao carregar suas reservas.</p>`;
  }
});

function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR");
}
function formatarDataHora(dataHora) {
  const opcoes = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Sao_Paulo",
  };
  return new Date(dataHora).toLocaleString("pt-BR", opcoes);
}


