const starContainer = document.getElementById("star-rating");
const hiddenInput = document.getElementById("nota");
const starTemplate = document.getElementById("star-template").content;

let currentRating = 0;

for (let i = 1; i <= 5; i++) {
  const star = starTemplate.cloneNode(true).querySelector("svg");
  star.dataset.value = i;
  star.addEventListener("click", () => {
    currentRating = i;
    hiddenInput.value = i;
    updateStars();
  });
  starContainer.appendChild(star);
}

function updateStars() {
  const stars = starContainer.querySelectorAll("svg");
  stars.forEach((star, index) => {
    star.classList.toggle("text-yellow-400", index < currentRating);
    star.classList.toggle("text-gray-300", index >= currentRating);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const reservaIdInput = document.getElementById("reservaId");

  const params = new URLSearchParams(window.location.search);
  const idReserva = params.get("idReserva");

  if (!idReserva) {
    console.error("ID da reserva não informado na URL.");
    alert("Reserva inválida. Retorne e tente novamente.");
    return;
  }

  reservaIdInput.value = idReserva;

  const form = document.getElementById("formAvaliacao");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nota = hiddenInput.value;
    const comentario = document.getElementById("comentario").value;

    try {
      const response = await fetch(`https://conexao-alimentar.onrender.com/avaliacoes/${idReserva}/avaliar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ nota, comentario })
      });

      if (!response.ok) {
        const erro = await response.text();
        throw new Error(erro);
      }

      alert("Avaliação enviada com sucesso!");
      window.location.href = "/pages/dashboard.html"; 
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
      alert("Erro ao enviar avaliação: " + err.message);
    }
  });
});
