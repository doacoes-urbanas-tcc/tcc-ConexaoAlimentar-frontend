//usando o jquery para configurar o botão de opções da versão mobile.
//busquei no site da biblioteca jquery cdn o link do pacote e inseri no index.html,
// junto com os demais links Agora vamos configurá-lo para quando clicar aparecer opçoes:

$(document).ready(function () {
    $('#mobile_btn').on('click', function () {
        $('#mobile_menu').toggleClass('active'); // criando classe dentro do active, para quando estiver na versao mobile, clicar no menu e aparecer uma lista.
        $('#mobile_btn').find('i').toggleClass('fa-x'); //quando clicar no botao de menu mobile aparecer um 'x'
    });

    // criando animação para quando rolar a página, os itens do menu serem
    // selecionados automaticamente, colocar a sompra embaixo da header quando
    //rolar a pagina e colocar o efeito das palabras e icones 'entrarem na pagina
    //quando chegar na seção.

    const sections = $('section'); //pegar as sections
    const navItems = $('.nav-item'); // pegar os itens da lista

    //quandro escrolar a pagina  vai selecionar os itens da seção referente no cabeçalho
    $(window).on('scroll', function () {
        const header = $('header'); // adicionar sombra no cabeçalho qdo rolar a pagina
        const scrollPosition = $(window).scrollTop() - header.outerHeight(); //definir a posição do scroll diminuindo o header, sendo no topo.

        let activeSectionIndex = 0;//animação para os textos e objetos 'entrerem' pewla esquerda. Será uma let e nao uma const, porque ela vai mudar nao sera constante 
        // e ela é o index da seção. Tem que fazer uma loop para pegar cada seção (linha 35).

        //'console.log(scrollPosition);' Para testar na inspeção;

        if (scrollPosition <= 0) { //incluir a box-shadow, que é a sombra que gera quando desce a pagina
            header.css('box-shadow', 'none');
        } else {
            header.css('box-shadow', '5px 1px 5px rgba(0, 0, 0, 0.1');
        }

        sections.each(function (i) { //(i) é o index da seção, para se saber em qual seção se está. Terá que prgar cada uma das seções na variavel const.
            const section = $(this); // para pegar ela mesma.
            const sectionTop = section.offset().top - 96; // para saber quando a seçãoa chegou no topo descontando a navbar. 
            const sectionBottom = sectionTop + section.outerHeight(); // para saber quando a seçãoa chegou no lá embaixo no final da pagina descontando a navbar.

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) { // if para saber se a rolagem esta dentro da area da seção específica que queremos. ela precisa estar dentro do top do botom. 
                activeSectionIndex = i; //se estier ok, passando o 'i', que é uma posição da seção. Outra seja, atualiza mostrando a mostrando a posição
                return false; //para sair do loop.
            }
        });

        navItems.removeClass('active'); //para remover o sublinhado quando nao estiver na seção
        $(navItems[activeSectionIndex]).addClass('active'); //adcionar a classe active, dependendo do index que está nosso item.
    });

    //para animação foi necessario copiar o link da biblioteca do https://scrollrevealjs.org/guide/hello-world.html e colcar no index.html
    ScrollReveal().reveal('#acta', { //animação
        origin: 'left',
        duration: 2000,
        distance: '20%'
    });

    ScrollReveal().reveal('#cta', {
        origin: 'left',
        duration: 2000,
        distance: '20%'
    });

    ScrollReveal().reveal('.dish', {
        origin: 'left',
        duration: 2000,
        distance: '20%'
    });

    ScrollReveal().reveal('#testimonial_maos_alimentos', {
        origin: 'left',
        duration: 1000,
        distance: '20%'
    })

    ScrollReveal().reveal('.feedback', {
        origin: 'right',
        duration: 1000,
        distance: '20%'
    })
});
