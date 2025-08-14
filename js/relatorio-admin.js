function showToast(message, type = "error") {
    const toast = document.createElement("div");
    toast.className = `fixed bottom-5 right-5 px-4 py-2 rounded shadow-lg text-white z-50 
        ${type === "success" ? "bg-green-600" : "bg-red-600"}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}

document.addEventListener("DOMContentLoaded", () => {
    const anoInput = document.getElementById("ano");
    if (anoInput && !anoInput.value) {
        anoInput.value = new Date().getFullYear();
    }
});

window.baixar = function (tipo, formato) {
    const token = localStorage.getItem("token");
    let url = `https://conexao-alimentar.onrender.com/admin/relatorio/${formato}/${tipo}`;

    if (tipo === 'doacoes-mensais' || tipo === 'doacoes-concluidas') {
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

            showToast("Relatório baixado com sucesso!", "success");
        })
        .catch(err => {
            showToast(`Falha ao baixar relatório: ${err.message}`, "error");
        });
};
