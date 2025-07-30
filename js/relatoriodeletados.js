// Função para buscar usuários desativados
async function buscarUsuariosDeletados() {
    try {
        const response = await fetch('/reprovar/{id}');
        const usuarios = await response.json();
        preencherTabela(usuarios);
    } catch (error) {
        alert('Erro ao buscar usuários desativados');
    }
}

// Função para preencher a tabela
function preencherTabela(usuarios) {
    const tbody = document.querySelector('#usuarios-table tbody');
    tbody.innerHTML = '';
    usuarios.forEach(usuario => {
        const tr = document.createElement('tr');
        tr.className = "border-b border-gray-100 hover:bg-gray-50";
        tr.innerHTML = `
            <td class="py-2 px-4">${usuario.id}</td>
            <td class="py-2 px-4">${usuario.nome || usuario.nomeFantasia || usuario.razaoSocial || ''}</td>
            <td class="py-2 px-4">${usuario.email}</td>
            <td class="py-2 px-4 text-center">
                <button onclick="deletarUsuario(${usuario.id})"
                    class="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-4 rounded transition">
                    Deletar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderUsuariosDesativados(usuarios) {
    const tbody = document.getElementById('usuarios-desativados-tbody');
    tbody.innerHTML = '';
    usuarios.forEach(usuario => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="px-4 py-2">${usuario.tipo || '-'}</td>
            <td class="px-4 py-2">${usuario.nome}</td>
            <td class="px-4 py-2">${usuario.email}</td>
            <td class="px-4 py-2">${usuario.estado || '-'}</td>
            <td class="px-4 py-2">${usuario.atuacao || '-'}</td>
            <td class="px-4 py-2">
                <button onclick="deletarUsuario(${usuario.id})" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs">Deletar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Função para deletar usuário
async function deletarUsuario(id) {
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
        try {
            const response = await fetch(`http://localhost:8080/usuarios/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                buscarUsuariosDeletados();
            } else {
                alert('Erro ao deletar usuário');
            }
        } catch (error) {
            alert('Erro ao deletar usuário');
        }
    }
}

// Chamada inicial para preencher a tabela de usuários desativados
buscarUsuariosDeletados();