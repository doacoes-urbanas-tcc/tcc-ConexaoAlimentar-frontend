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
    showError("Reserva inválida. Retorne e tente novamente.");
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

      showSuccess("Avaliação enviada com sucesso!", () => {
      const tipoUsuario = localStorage.getItem("tipoUsuario")?.toLowerCase();

      switch (tipoUsuario) {
        case "ONG":
        window.location.href = "/pages/ong/home-page-ong.html";
        break;
      case "COMERCIO":
        window.location.href = "/pages/doador/home-page-doador.html";
        break;
      case "VOLUNTARIO":
        window.location.href = "/pages/voluntario/home-page-voluntario.html";
        break;
      case "ADMIN":
        window.location.href = "/pages/administrador/dashboard-administrador.html";
        break;
      case "PRODUTOR_RURAL":
        window.location.href = "/pages/doador/home-page-doador.html";
        break;
      case "PESSOA_FISICA":
        window.location.href = "/pages/doador/home-page-doador.html";
        break;

      default:
       window.location.href = "/pages/dashboard.html";
    }
    });

    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
      showError("Erro ao enviar avaliação: " + err.message);
    }
  });
});
function showSuccess(message, onOk = null) {
  const modal = document.getElementById('modalSuccess');
  const msgEl = document.getElementById('mensagem-sucesso');
  msgEl.textContent = message;
  modal.classList.remove('hidden');

  function closeHandler() {
    modal.classList.add('hidden');
    if (onOk) onOk();
    removeListeners();
  }

  function removeListeners() {
    okBtn.removeEventListener('click', closeHandler);
    closeBtn.removeEventListener('click', closeHandler);
  }

  const okBtn = modal.querySelector('button.bg-green-500');
  const closeBtn = modal.querySelector('button.absolute');

  okBtn.addEventListener('click', closeHandler);
  closeBtn.addEventListener('click', closeHandler);
}

function showError(message, onOk = null) {
  const modal = document.getElementById('modalError');
  const msgEl = document.getElementById('mensagem-erro');
  msgEl.textContent = message;
  modal.classList.remove('hidden');

  function closeHandler() {
    modal.classList.add('hidden');
    if (onOk) onOk();
    removeListeners();
  }

  function removeListeners() {
    okBtn.removeEventListener('click', closeHandler);
    closeBtn.removeEventListener('click', closeHandler);
  }

  const okBtn = modal.querySelector('button.bg-red-500');
  const closeBtn = modal.querySelector('button.absolute');

  okBtn.addEventListener('click', closeHandler);
  closeBtn.addEventListener('click', closeHandler);
}


