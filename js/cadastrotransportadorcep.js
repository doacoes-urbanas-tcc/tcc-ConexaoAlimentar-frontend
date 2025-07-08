document.addEventListener('DOMContentLoaded', function () {
    const cepInput = document.getElementById('cep');
    const cidadeEstadoInput = document.getElementById('cidade_estado');

    if (cepInput) {
        cepInput.addEventListener('blur', async function () {
            const cep = cepInput.value.replace(/\D/g, '');
            if (cep.length !== 8) return;

            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();
                if (!data.erro) {
                    cidadeEstadoInput.value = `${data.localidade} | ${data.uf}`;
                } else {
                    cidadeEstadoInput.value = '';
                }
            } catch {
                cidadeEstadoInput.value = '';
            }
        });
    }
});