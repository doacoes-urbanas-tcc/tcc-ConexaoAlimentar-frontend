function mostrarDescricao() {
    const select = document.getElementById('tipoUsuario');
    const descricao = document.getElementById('descricaoUsuario');
    const container = document.getElementById('descricaoContainer');

    const descricoes = {
        pf: "Pessoa comum que deseja doar alimentos ou produtos como indivíduo.",
        cnpj: "Estabelecimentos comerciais ou empresas que fazem doações como pessoa jurídica.",
        ong: "Organizações que recebem e distribuem as doações para quem precisa.",
        rural: "Produtores do campo que desejam doar excedentes da produção.",
        voluntario: "Pessoas que ajudam em áreas como TI, marketing, eventos, etc.",
        admin: "Equipe de gestão ou desenvolvimento do sistema com acesso administrativo."
    };

    const valorSelecionado = select.value;
    if (descricoes[valorSelecionado]) {
        descricao.textContent = descricoes[valorSelecionado];
        container.classList.remove("hidden");
    } else {
        descricao.textContent = "";
        container.classList.add("hidden");
    }
}