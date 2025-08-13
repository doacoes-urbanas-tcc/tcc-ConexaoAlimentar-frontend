const starContainer = document.getElementById("star-rating");
const hiddenInput = document.getElementById("nota");

for (let i = 1; i <= 5; i++) {
  const star = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  star.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  star.setAttribute("viewBox", "0 0 20 20");
  star.setAttribute("fill", "currentColor");
  star.classList.add("w-8", "h-8", "text-gray-300", "cursor-pointer");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.007 3.09a1 1 0 00.95.69h3.252c.969 0 1.371 1.24.588 1.81l-2.63 1.91a1 1 0 00-.364 1.118l1.007 3.09c.3.921-.755 1.688-1.54 1.118l-2.63-1.91a1 1 0 00-1.175 0l-2.63 1.91c-.784.57-1.838-.197-1.539-1.118l1.006-3.09a1 1 0 00-.364-1.118l-2.63-1.91c-.783-.57-.38-1.81.588-1.81h3.252a1 1 0 00.95-.69l1.007-3.09z");

  star.appendChild(path);
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
        case "ong":
        window.location.href = "/pages/ong/home-page-ong.html";
        break;
      case "comercio":
        window.location.href = "/pages/doador/home-page-doador.html";
        break;
      case "voluntario":
        window.location.href = "/pages/voluntario/home-page-voluntario.html";
        break;
      case "admin":
        window.location.href = "/pages/administrador/dashboard-administrador.html";
        break;
      case "rural":
        window.location.href = "/pages/doador/home-page-doador.html";
        break;
      case "pf":
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


