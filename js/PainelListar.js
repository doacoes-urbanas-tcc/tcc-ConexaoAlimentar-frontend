// checklist.js

async function carregarCheckList() {
    const lista = document.getElementById('lista-itens');

    try {
        // Altere a URL conforme necessário
        const response = await fetch('http://localhost:8080/api/usuarios/ativos');

        if (!response.ok) throw new Error('Erro ao buscar dados');

        const dados = await response.json();

        // Remove entradas anteriores (exceto o cabeçalho)
        lista.querySelectorAll('li:not(:first-child)').forEach(el => el.remove());

        dados.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = "flex bg-gray-100 rounded-lg px-2 py-2 text-sm text-gray-800";

            li.innerHTML = `
                <span class="flex-1">${item.nome || 'N/A'}</span>
                <span class="flex-1">${item.endereco || 'N/A'}</span>
                <span class="flex-1">${item.horario || '08:00 - 17:00'}</span>
                <span class="flex-1">${item.ativo ? 'Ativo' : 'Pendente'}</span>
                <span class="flex-1">${item.retirada || 'Próprio'}</span>
            `;

            lista.appendChild(li);
        });

    } catch (error) {
        console.error('Erro:', error);
        alert('Não foi possível carregar o check list.');
    }
}
