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
            if (res.status === 403) {
                let mensagem = "Nenhum relatório encontrado para o período selecionado ou você não tem permissão.";
                try {
                    const data = await res.json();
                    if (data?.message) mensagem = data.message;
                } catch (e) {}
                throw new Error(mensagem);
            }
            throw new Error(`Erro ${res.status}`);
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
        toastError(err.message || "Erro inesperado.");
    });
};

function toastSuccess(message) {
    showToast(message, "bg-green-500");
}

function toastError(message) {
    showToast(message, "bg-red-500");
}

function showToast(message, bgColor) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `${bgColor} text-white px-4 py-2 rounded shadow-lg animate-slideInRight fixed top-4 right-4 z-50`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("animate-fadeOut");
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
