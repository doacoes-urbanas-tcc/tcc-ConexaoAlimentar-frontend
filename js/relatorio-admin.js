'use strict';

function toastError(message) {
    showToast(message, "#f44336");
}
function toastSuccess(message) {
    showToast(message, "#4CAF50");
}
function showToast(message, bgColor) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.backgroundColor = bgColor;
    toast.style.color = "white";
    toast.style.padding = "12px 20px";
    toast.style.borderRadius = "8px";
    toast.style.zIndex = "9999";
    toast.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
    toast.style.fontFamily = "Arial, sans-serif";
    toast.style.fontSize = "14px";
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

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
