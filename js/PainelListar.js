// Função para carregar o check list
async function carregarCheckList() {
 
    const tipoUsuario = document.getElementById('tipoUsuario').value;
    const endpoint = `http://localhost:8080/admin/usuarios/pendentes/${tipoUsuario}`;

    try {
        const response = await fetch(endpoint,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar o check list!');
        }

        const data = await response.json();

        // Acessando o elemento da lista de itens
        const listaItens = document.getElementById('lista itens');
        
        // Limpar a lista antes de adicionar os novos itens
        listaItens.innerHTML = '';

        // Iterando sobre os dados retornados da API para preencher a lista
        data.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'flex text-sm text-gray-700 px-2 py-2 border-b';

            // Estrutura de cada item com os campos: Item, Endereço, Horário, Status e Retirada
            listItem.innerHTML = `
                <span class="flex-1">${item.nomeItem}</span>
                <span class="flex-1">${item.endereco}</span>
                <span class="flex-1">${item.horario}</span>
                <span class="flex-1">${item.status}</span>
                <span class="flex-1">${item.retirada}</span>
            `;
            // Adicionando o item à lista
            listaItens.appendChild(listItem);
        });

    } catch (error) {
        console.error('Erro ao carregar check list:', error);
        alert('Erro ao carregar o check list.');
    }
    

}
