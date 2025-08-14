'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const previewContainer = document.getElementById('previewContainer');
  const fileInput = document.getElementById('urlImagem');
  const dataValidadeInput = document.getElementById('dataValidade');
  const form = document.querySelector('form');

  if (fileInput && previewContainer) {
    fileInput.addEventListener('change', function () {
      const file = this.files?.[0];
      previewContainer.innerHTML = '';

      if (file) {
        const preview = document.createElement('img');
        preview.src = URL.createObjectURL(file);
        preview.className = 'mt-2 max-h-40 rounded';
        previewContainer.appendChild(preview);
      }
    });
  }

  if (dataValidadeInput) {
    const today = new Date().toISOString().split('T')[0];
    dataValidadeInput.setAttribute('min', today);
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const token = localStorage.getItem('token');
      if (!token) {
        showToast('Você precisa estar logado para cadastrar uma doação.', 'error');
        return;
      }

      const dto = {
        nomeAlimento: document.getElementById('nomeAlimento')?.value || '',
        unidadeMedida: document.getElementById('unidadeMedida')?.value || '',
        quantidade: parseFloat(document.getElementById('quantidade')?.value) || 0,
        dataValidade: document.getElementById('dataValidade')?.value || '',
        descricao: document.getElementById('descricao')?.value || '',
        categoria: document.getElementById('categoria')?.value || ''
      };

      const imagemFile = fileInput?.files?.[0];
      if (!imagemFile) {
        showToast('Por favor, selecione uma imagem.', 'error');
        return;
      }

      const formData = new FormData();
      formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
      formData.append('file', imagemFile);

      const botao = form.querySelector('button[type=submit]');
      if (botao) {
        botao.disabled = true;
        botao.textContent = 'Enviando...';
      }

      try {
        const response = await fetch('https://conexao-alimentar.onrender.com/doacoes/cadastrar', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });

        const text = await response.text();

        if (response.ok) {
          showToast('Doação cadastrada com sucesso!', 'success');
          setTimeout(() => {
            window.location.href = '/pages/doacao/minhas-doacoes.html';
          }, 1500);
        } else {
          showToast('Erro ao cadastrar doação: ' + text, 'error');
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
        showToast('Erro ao cadastrar a doação.', 'error');
      } finally {
        if (botao) {
          botao.disabled = false;
          botao.textContent = 'Cadastrar';
        }
      }
    });
  }
});

/**
 * Função genérica para exibir toasts
 * @param {string} message - Texto do toast
 * @param {string} type - Tipo: success, error ou info
 */
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed top-4 right-4 space-y-2 z-50';
    document.body.appendChild(toastContainer);
  }

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  const toast = document.createElement('div');
  toast.className = `${colors[type] || colors.info} text-white px-4 py-2 rounded shadow-md transition-opacity duration-300 opacity-100`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
