function voltar() {
    // Exemplo: voltar para a página anterior
    window.history.back();
}

function cadastrosRecebidos() {
    // Redirecione ou abra a tela de cadastros recebidos
    alert('Abrir Cadastros Recebidos');
    // window.location.href = 'cadastros-recebidos.html';
}

function relatorioUsuarios() {
    alert('Abrir Relatório Usuários');
    // window.location.href = 'relatorio-usuarios.html';
}

function painelDoacoesAtivas() {
    alert('Abrir Painel Doações Ativas');
    // window.location.href = 'painel-doacoes-ativas.html';
}

function relatoriosDiversos() {
    alert('Abrir Relatórios Diversos');
    // window.location.href = 'relatorios-diversos.html';
}

function historicoDoacoes() {
    alert('Abrir Histórico de Doações e Estatística');
    // window.location.href = 'historico-doacoes.html';
}

// Função para alternar o menu mobile
document.getElementById('menu-toggle').onclick = function () {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}