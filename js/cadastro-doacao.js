document.addEventListener("DOMContentLoaded", function () {
  const previewContainer = document.getElementById("previewContainer");  
  const fileInput = document.getElementById("urlImagem");
  const dataValidadeInput = document.getElementById("dataValidade");
  const form = document.querySelector("form");

  if (fileInput && previewContainer) {
    fileInput.addEventListener("change", function () {
      const file = this.files[0];
      previewContainer.innerHTML = ""; 

      if (file) {
        const preview = document.createElement("img");
        preview.src = URL.createObjectURL(file);
        preview.className = "mt-2 max-h-40 rounded";
        previewContainer.appendChild(preview); 
      }
    });
  }

  if (dataValidadeInput) {
    const today = new Date().toISOString().split("T")[0];
    dataValidadeInput.setAttribute("min", today);
  }

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const token = localStorage.getItem("token");
      if (!token) {
        showError("Você precisa estar logado para cadastrar uma doação.");
        return;
      }

      const dto = {
        nomeAlimento: document.getElementById("nomeAlimento").value,
        unidadeMedida: document.getElementById("unidadeMedida").value,
        quantidade: parseFloat(document.getElementById("quantidade").value),
        dataValidade: document.getElementById("dataValidade").value,
        descricao: document.getElementById("descricao").value,
        categoria: document.getElementById("categoria").value
      };

      const imagemFile = document.getElementById("urlImagem").files[0];
      if (!imagemFile) {
        alert("Por favor, selecione uma imagem.");
        return;
      }

      const formData = new FormData();
      formData.append("dto", new Blob([JSON.stringify(dto)], { type: "application/json" }));
      formData.append("file", imagemFile);

      const botao = form.querySelector("button[type=submit]");
      botao.disabled = true;
      botao.textContent = "Enviando...";

      try {
        const response = await fetch("https://conexao-alimentar.onrender.com/doacoes/cadastrar", {
          method: "POST",
          headers: { "Authorization": "Bearer " + token },
          body: formData
        });

        const text = await response.text();

        if (response.ok) {
          showSuccess("Doação cadastrada com sucesso!", () => {
            window.location.href = "/pages/doacao/minhas-doacoes.html";
          });
        } else {
          showError("Erro ao cadastrar doação: " + text);
        }

      } catch (error) {
        console.error("Erro na requisição:", error);
        showError("Erro ao cadastrar a doação.");
      } finally {
        botao.disabled = false;
        botao.textContent = "Cadastrar";
      }
    });
  }
});

function showSuccess(message, onOk = null) {
  const modal = document.getElementById('modalSuccess');
  if (!modal) return;

  const msgEl = document.getElementById('mensagem-sucesso');
  if (msgEl) msgEl.textContent = message;

  modal.classList.remove('hidden');

  const okBtn = modal.querySelector('button.bg-green-500');
  const closeBtn = modal.querySelector('button.absolute');

  const closeHandler = () => {
    modal.classList.add('hidden');
    if (onOk) onOk();
    if (okBtn) okBtn.removeEventListener('click', closeHandler);
    if (closeBtn) closeBtn.removeEventListener('click', closeHandler);
  };

  if (okBtn) okBtn.addEventListener('click', closeHandler);
  if (closeBtn) closeBtn.addEventListener('click', closeHandler);
}

function showError(message, onOk = null) {
  const modal = document.getElementById('modalError');
  if (!modal) return;

  const msgEl = document.getElementById('mensagem-erro');
  if (msgEl) msgEl.textContent = message;

  modal.classList.remove('hidden');

  const okBtn = modal.querySelector('button.bg-red-500');
  const closeBtn = modal.querySelector('button.absolute');

  const closeHandler = () => {
    modal.classList.add('hidden');
    if (onOk) onOk();
    if (okBtn) okBtn.removeEventListener('click', closeHandler);
    if (closeBtn) closeBtn.removeEventListener('click', closeHandler);
  };

  if (okBtn) okBtn.addEventListener('click', closeHandler);
  if (closeBtn) closeBtn.addEventListener('click', closeHandler);
}
