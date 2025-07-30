// Suponha que sua API seja algo como /api/usuarios/ativos
async function carregarUsuarios() {
    try {
        const response = await fetch('/api/usuarios/ativos');
        const usuarios = await response.json();

        const tbody = document.getElementById('usuarios-tbody');
        tbody.innerHTML = '';

        usuarios.forEach(usuario => {
            const tr = document.createElement('tr');
            tr.classList.add('bg-white');

            tr.innerHTML = `
                <td class="px-4 py-2 text-sm text-gray-800">${usuario.tipo || '-'}</td>
                <td class="px-4 py-2 text-sm text-gray-800">${usuario.nome}</td>
                <td class="px-4 py-2 text-sm text-gray-800">${usuario.email}</td>
                <td class="px-4 py-2 text-sm text-gray-800">${usuario.estado || '-'}</td>
                <td class="px-4 py-2 text-sm text-blue-600 hover:underline cursor-pointer">Detalhes</td>
            `;

            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}

// Chama ao carregar a página
document.addEventListener('DOMContentLoaded', carregarUsuarios);

// Exportar PDF
function exportarParaPDF() {
    const tabela = document.getElementById('tabela-usuarios');
    const opt = {
        margin:       0.5,
        filename:     'usuarios-ativos.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(tabela).save();
}
