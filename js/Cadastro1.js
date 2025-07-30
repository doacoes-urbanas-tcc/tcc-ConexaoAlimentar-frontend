// Exemplo de dados simulados (substitua por chamada à sua API)
const cadastrosPendentes = [
    { id: 1, tipo: 'ONG', nome: 'ONG Esperança', email: 'ong@exemplo.com', estado: 'SP', atuacao: 'Alimentos' },
    { id: 2, tipo: 'Comércio', nome: 'Mercado Bom Preço', email: 'mercado@exemplo.com', estado: 'RJ', atuacao: 'Varejo' },
    // ...mais cadastros
];

function renderCadastros() {
    const tbody = document.getElementById('cadastros-tbody');
    tbody.innerHTML = '';
    cadastrosPendentes.forEach(cadastro => {
        const tr = document.createElement('tr');
        tr.className = 'bg-white border-b';
        tr.innerHTML = `
            <td class="px-4 py-2">${cadastro.tipo}</td>
            <td class="px-4 py-2">${cadastro.nome}</td>
            <td class="px-4 py-2">${cadastro.email}</td>
            <td class="px-4 py-2">${cadastro.estado}</td>
            <td class="px-4 py-2">${cadastro.atuacao}</td>
            <td class="px-4 py-2 flex gap-2">
                <button onclick="aprovar(${cadastro.id})" class="bg-green-500 text-white px-2 py-1 rounded">Aprovar</button>
                <button onclick="reprovar(${cadastro.id})" class="bg-red-500 text-white px-2 py-1 rounded">Rejeitar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}
// Função do botão "Voltar"
function voltar() {
    alert("Você está prestes a voltar para a página anterior.");
    const confirmVoltar = confirm("Você tem certeza que deseja voltar?");
    if (confirmVoltar) {
        window.location.href = 'administrador.html';
    };
}

function aprovar(id) {
    // Chame sua API para aprovar
    alert('Aprovado: ' + id);
}

function reprovar(id) {
    // Chame sua API para reprovar
    alert('Rejeitado: ' + id);
}

window.renderCadastros = renderCadastros;
window.aprovar = aprovar;
window.reprovar = reprovar;

document.addEventListener('DOMContentLoaded', renderCadastros);