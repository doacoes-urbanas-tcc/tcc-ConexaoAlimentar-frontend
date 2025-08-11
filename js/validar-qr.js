document.addEventListener("DOMContentLoaded", () => {
  const mensagem = document.getElementById("mensagem");
  const cameraContainer = document.getElementById("camera-container");
  const qrScanner = new Html5Qrcode("preview");

  let idDoacaoEscaneada = null;

  function validarRetirada() {
    if (!idDoacaoEscaneada) {
      mensagem.textContent = "Nenhuma doação escaneada para validar.";
      mensagem.classList.replace("text-gray-700", "text-red-600");
      return;
    }

    const token = localStorage.getItem("token");

    fetch(`https://conexao-alimentar.onrender.com/doacoes/validar-qr/${idDoacaoEscaneada}`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token
      }
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(texto => { throw new Error(texto); });
        }
        return response.json();
      })
      .then(data => {
         mensagem.textContent = "Retirada validada com sucesso!";
         mensagem.classList.replace("text-red-600", "text-green-600");
         const btn = document.getElementById("btnValidarRetirada");
         if (btn) btn.style.display = "none";

         const idReserva = data.reservaId || data.idReserva; 

         if (idReserva) {
         window.location.href = `/pages/avaliacao/avaliacao.html?idReserva=${idReserva}`;
        } else {
        console.warn("idReserva não recebido na resposta do servidor.");
       }
      })
      .catch(error => {
        mensagem.textContent = "Erro ao validar retirada: " + error.message;
        mensagem.classList.replace("text-green-600", "text-red-600");
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
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
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

          mensagem.textContent = `QR Code escaneado: ${idDoacaoEscaneada}`;
          mensagem.classList.replace("text-red-600", "text-gray-700");
        }
      );
    } else {
      mensagem.textContent = "Nenhuma câmera encontrada.";
    }
  }).catch(err => {
    mensagem.textContent = "Erro ao acessar a câmera: " + err;
  });
});
