document.addEventListener("DOMContentLoaded", () => {
  const videoElement = document.getElementById("preview");
  const mensagem = document.getElementById("mensagem");

  const qrScanner = new Html5Qrcode("preview");

  function validarQrCode(idDoacao) {
  const token = localStorage.getItem("token");

  fetch(`https://conexao-alimentar.onrender.com/doacoes/validar-qr/${idDoacao}`, {
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
    const idReserva = data.idReserva;
    window.location.href = `../avaliacao/avaliacao.html?idReserva=${idReserva}`;
  })
  .catch(error => {
    mensagem.textContent = error.message;
    mensagem.classList.replace("text-gray-700", "text-red-600");
  });
}


  Html5Qrcode.getCameras().then(cameras => {
    if (cameras && cameras.length) {
      const cameraId = cameras[0].id;
      qrScanner.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        qrCodeMessage => {
          qrScanner.stop(); 
          validarQrCode(qrCodeMessage.trim());
        }
      );
    } else {
      mensagem.textContent = "Nenhuma câmera encontrada.";
    }
  }).catch(err => {
    mensagem.textContent = "Erro ao acessar a câmera: " + err;
  });
});
