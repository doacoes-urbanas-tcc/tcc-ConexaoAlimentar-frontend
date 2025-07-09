document.addEventListener('DOMContentLoaded', function () {
    const cepInput = document.getElementById('cep');
    const ruaInput = document.getElementById('rua');
    const bairroInput = document.getElementById('bairro');
    const cidadeEstadoInput = document.getElementById('cidade_estado');

    if (cepInput) {
        cepInput.addEventListener('input', async function () {
            const cep = cepInput.value.replace(/\D/g, '');
            if (cep.length !== 8) return;

            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();
                if (!data.erro) {
                    ruaInput.value = data.logradouro || '';
                    bairroInput.value = data.bairro || '';
                    cidadeEstadoInput.value = `${data.localidade || ''} | ${data.uf || ''}`;
                } else {
                    ruaInput.value = '';
                    bairroInput.value = '';
                    cidadeEstadoInput.value = '';
                }
            } catch {
                ruaInput.value = '';
                bairroInput.value = '';
                cidadeEstadoInput.value = '';
            }
        });
    }
});