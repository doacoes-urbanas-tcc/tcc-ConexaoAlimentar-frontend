document.addEventListener("DOMContentLoaded", function () {
  const nome = localStorage.getItem('nome');
  const boasVindasEl = document.getElementById('boasVindas');
  if (nome) {
    boasVindasEl.textContent = `Seja bem-vindo, ${nome}!`;
  } else {
    boasVindasEl.textContent = `Seja bem-vindo!`;
  }
});