'use strict';

window.baixar = function (tipo, formato) {
    const token = localStorage.getItem("token");

    if (!token) {
        toastError("Você não está autenticado!");
        return;
    }

    let url = `https://conexao-alimentar.onrender.com/admin/relatorio/${formato}/${tipo}`;

    if (tipo === "doacoes-mensais") {
        const mes = document.getElementById("mes").value;
        const ano = document.getElementById("ano").value;

        if (!mes || !ano) {
            toastError("Preencha mês e ano.");
            return;
        }
        url += `?ano=${ano}&mes=${mes}`;
    }

    fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(async res => {
        if (!res.ok) {
            let errorMsg = `Erro ${res.status}`;
            try {
                const data = await res.json();
                if (data.message) errorMsg = data.message;
            } catch (e) {}
            
            throw new Error(errorMsg);
        }
        return res.blob();
    })
    .then(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `relatorio_${tipo}_${new Date().toISOString().split('T')[0]}.${formato}`;
        document.body.appendChild(link);
        link.click();
        link.remove();

        toastSuccess("Relatório baixado com sucesso!");
    })
    .catch(err => {
        toastError(err.message || "Ocorreu um erro inesperado.");
    });
};
