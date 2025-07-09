document.addEventListener('DOMContentLoaded', function () {
    const cpfInput = document.querySelector('input[placeholder="CPF"]');

    if (cpfInput) {
        cpfInput.addEventListener('blur', function () {
            const cpf = cpfInput.value.replace(/\D/g, '');
            if (cpf.length === 11) {
                if (validaCPF(cpf)) {
                    cpfInput.classList.remove('border-red-500');
                    cpfInput.classList.add('border-green-500');
                    cpfInput.title = "CPF válido";
                } else {
                    cpfInput.classList.remove('border-green-500');
                    cpfInput.classList.add('border-red-500');
                    cpfInput.title = "CPF inválido";
                }
            } else if (cpf.length > 0) {
                cpfInput.classList.remove('border-green-500');
                cpfInput.classList.add('border-red-500');
                cpfInput.title = "CPF inválido";
            } else {
                cpfInput.classList.remove('border-green-500', 'border-red-500');
                cpfInput.title = "";
            }
        });
    }

    function validaCPF(cpf) {
        if (/^(\d)\1+$/.test(cpf)) return false;
        let soma = 0;
        for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;
        soma = 0;
        for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        return resto === parseInt(cpf.charAt(10));
    }
});