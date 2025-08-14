document.addEventListener("DOMContentLoaded", () => {
  const cameraContainer = document.getElementById("camera-container");
  const qrScanner = new Html5Qrcode("preview");
  let idDoacaoEscaneada = null;

  function validarRetirada() {
    if (!idDoacaoEscaneada) {
      showToast("Nenhuma doação escaneada para validar.", "error");
      return;
    }

    const token = localStorage.getItem("token");

    fetch(`https://conexao-alimentar.onrender.com/doacoes/validar-qr/${idDoacaoEscaneada}`, {
      method: "POST",
      headers: { "Authorization": "Bearer " + token }
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(texto => { throw new Error(texto); });
        }
        return response.json();
      })
      .then(data => {
        showToast("Retirada validada com sucesso!", "success");

        const btn = document.getElementById("btnValidarRetirada");
        if (btn) btn.remove();

        const idReserva = data.reservaId || data.idReserva;
        if (idReserva) {
          setTimeout(() => {
            window.location.href = `/pages/avaliacao/avaliacao.html?idReserva=${idReserva}`;
          }, 1500);
        } else {
          console.warn("idReserva não recebido na resposta do servidor.");
        }
      })
      .catch(error => {
        showToast("Erro ao validar retirada: " + error.message, "error");
      });
  }

  Html5Qrcode.getCameras().then(cameras => {
    if (cameras && cameras.length) {
      const backCamera = cameras.find(cam =>
        cam.label.toLowerCase().includes("back") ||
        cam.label.toLowerCase().includes("traseira") ||
        cam.label.toLowerCase().includes("rear")
      );

      const cameraId = backCamera ? backCamera.id : cameras[0].id;

      qrScanner.start(
        cameraId,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        qrCodeMessage => {
          qrScanner.stop();

          try {
            const dados = JSON.parse(qrCodeMessage);
            idDoacaoEscaneada = dados.doacaoId;
          } catch (e) {
            idDoacaoEscaneada = qrCodeMessage.trim();
          }

          if (!document.getElementById("btnValidarRetirada")) {
            const btn = document.createElement("button");
            btn.id = "btnValidarRetirada";
            btn.textContent = "Validar Retirada";
            btn.className = "block mx-auto mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold";
            btn.onclick = validarRetirada;
            cameraContainer.appendChild(btn);
          }

          showToast(`QR Code escaneado: ${idDoacaoEscaneada}`, "info");
        }
      );
    } else {
      showToast("Nenhuma câmera encontrada.", "error");
    }
  }).catch(err => {
    showToast("Erro ao acessar a câmera: " + err, "error");
  });
});

function showToast(message, type = "info") {
  const toastContainer = document.getElementById("toast-container");
  if (!toastContainer) return;

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500"
  };

  const toast = document.createElement("div");
  toast.className = `${colors[type] || colors.info} text-white px-4 py-2 rounded shadow-md transition-opacity duration-300 opacity-100`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
