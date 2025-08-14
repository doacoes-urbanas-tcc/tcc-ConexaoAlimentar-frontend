
window.baixar = function (tipo, formato) {
    const token = localStorage.getItem("token");
    let url = `https://conexao-alimentar.onrender.com/admin/relatorio/${formato}/${tipo}`;

    if (tipo === 'doacoes-mensais') {
        const mes = document.getElementById('mes').value;
        const ano = document.getElementById('ano').value;
        url += `?mes=${mes}&ano=${ano}`;
    }

    fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`Erro ${res.status}: ${res.statusText}`);
            }
            return res.blob();
        })
        .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `relatorio_${tipo}_${new Date().toISOString().split('T')[0]}.${formato}`;
            document.body.appendChild(link);
            link.click();
            link.remove();
        })
        .catch(err => alert(`Falha ao baixar relatório: ${err.message}`));
};
