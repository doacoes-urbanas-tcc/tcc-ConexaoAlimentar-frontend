// Função para simular logout
function sair() {
    alert('Você saiu do sistema.');
    window.location.href = '/pages/login.html'; // ajuste o caminho conforme seu projeto
}

// Exemplo de carregamento dinâmico de doações
function carregarDoacoes() {
    const doacoes = [
        { item: 'Arroz', recebedor: 'ONG Esperança' },
        { item: 'Feijão', recebedor: 'Projeto Vida' },
        { item: 'Macarrão', recebedor: 'Casa Solidária' },
        { item: 'Leite', recebedor: 'Lar dos Sonhos' }
    ];

    const container = document.querySelector('.divide-y');
    if (container) {
        container.innerHTML = '';
        doacoes.forEach(d => {
            container.innerHTML += `
                <div class="flex items-center py-1">
                    <span class="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    <span class="text-sm font-semibold text-gray-700 flex-1">${d.item}</span>
                    <span class="text-sm text-gray-500">${d.recebedor}</span>
                </div>
            `;
        });
    }
}

// Exemplo de carregamento dinâmico de comentários
function carregarComentarios() {
    const comentarios = [
        "Ótimo projeto, ajudou muito!",
        "Equipe atenciosa e dedicada.",
        "Recebi as doações rapidamente.",
        "Parabéns pela iniciativa!"
    ];
    const comentariosDiv = document.querySelector('.text-xs.text-gray-600.text-center');
    if (comentariosDiv) {
        comentariosDiv.innerHTML = comentarios.join('<br>');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Botão Sair
    const sairBtn = Array.from(document.querySelectorAll('span')).find(span => span.textContent.trim() === 'Sair');
    if (sairBtn) sairBtn.addEventListener('click', sair);

    carregarDoacoes();
    carregarComentarios();

    // Gráfico de barras simples usando Chart.js
    const ctx = document.getElementById('graficoEstatistica').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item'],
            datasets: [{
                label: 'Doações',
                data: [7, 10, 6, 9, 5, 8, 7, 6],
                backgroundColor: '#ef4444',
                borderRadius: 8,
                barPercentage: 0.7,
                categoryPercentage: 0.7
            },
            {
                label: 'Meta',
                data: [12, 12, 12, 12, 12, 12, 12, 12],
                backgroundColor: '#fca5a5',
                borderRadius: 8,
                barPercentage: 0.7,
                categoryPercentage: 0.7
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 10 } }
                },
                y: {
                    beginAtZero: true,
                    grid: { display: false },
                    ticks: { display: false }
                }
            }
        }
    });
});