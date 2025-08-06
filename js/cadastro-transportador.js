'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const voluntarioId = localStorage.getItem("usuarioId");

    if (!voluntarioId) {
      alert("ID do voluntário não encontrado. Faça o login novamente.");
      return;
    }

    const placa = document.getElementById("placa").value;
    const modelo = document.getElementById("modelo").value;
    const cor = document.getElementById("cor").value;
    const carga = document.getElementById("carga").value;
    const cnhFile = document.getElementById("cnh").files[0];

    if (!placa || !modelo || !cor || !carga || !cnhFile) {
      alert("Preencha todos os campos e selecione uma imagem da CNH.");
      return;
    }

    const dto = {
      placa,
      modelo,
      cor,
      capacidadeCarga: carga
    };

    const formData = new FormData();
    formData.append("dados", new Blob([JSON.stringify(dto)], { type: "application/json" }));
    formData.append("cnh", cnhFile);

    try {
      const response = await fetch(`https://conexao-alimentar.onrender.com/${voluntarioId}/veiculo`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const resText = await response.text();
        throw new Error("Erro ao cadastrar veículo: " + resText);
      }

      alert("Veículo cadastrado com sucesso!");
      form.reset();
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar dados do veículo. Tente novamente.");
    }
  });
});
