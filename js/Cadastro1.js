// Função para carregar os cadastros pendentes
async function carregarCadastrosPendentes() {
    try {
        // Requisição para obter os cadastros pendentes
        const response = await fetch('http://localhost:8080/admin/usuarios/');
        
        // Verifica se a resposta é ok
        if (!response.ok) {
            throw new Error('Erro ao carregar os cadastros!');
        }

        const data = await response.json();

        // Preencher a lista de cadastros
        const lista = document.getElementById('cadastros-list');
        lista.innerHTML = '';  // Limpar a lista antes de preencher

        // Iterar sobre os cadastros recebidos e criar os itens da lista
        data.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'bg-gray-50 p-4 rounded-lg shadow-md';
            listItem.innerHTML = `
                <div class="flex justify-between items-center">
                    <div class="flex flex-col">
                        <span class="font-bold text-lg text-gray-800">${item.nome}</span>
                        <span class="text-sm text-gray-500">${item.tipoCadastro}</span>
                    </div>
                    <div class="flex space-x-2">
                        <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700" onclick="aprovarCadastro(${item.id})">Aprovar</button>
                        <button class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700" onclick="reprovarCadastro(${item.id})">Reprovar</button>
                        <button class="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700" onclick="deletarCadastro(${item.id})">Deletar</button>
                    </div>
                </div>
            `;
            lista.appendChild(listItem);
        });
    } catch (error) {
        console.error('Erro ao carregar cadastros:', error);
        alert('Erro ao carregar os cadastros.');
    }
}

// Função para aprovar um cadastro
async function aprovarCadastro(id) {
    try {
        const response = await fetch(`http://localhost:8080/admin/usuarios/aprovar/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao aprovar o cadastro!');
        }

        const result = await response.json();
        alert(result.message || 'Cadastro aprovado com sucesso!');
        carregarCadastrosPendentes();  // Atualizar a lista
    } catch (error) {
        console.error('Erro ao aprovar cadastro:', error);
        alert('Erro ao aprovar cadastro.');
    }
}

// Função para reprovar um cadastro
async function reprovarCadastro(id) {
    try {
        const response = await fetch(`http://localhost:8080/admin/usuarios/reprovar/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao reprovar o cadastro!');
        }

        const result = await response.json();
        alert(result.message || 'Cadastro reprovado com sucesso!');
        carregarCadastrosPendentes();  // Atualizar a lista
    } catch (error) {
        console.error('Erro ao reprovar cadastro:', error);
        alert('Erro ao reprovar cadastro.');
    }
}
