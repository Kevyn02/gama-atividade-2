var pagIni = 1;
var quartos;
var tipo = [];

//Pegando a base de dados
var requestURL = 'https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72';
var request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function () {
    quartos = request.response;
    criandoDinamincamenteCards();
    criandoOptions();
    criaPaginas();
}

var card = document.getElementsByClassName('card');
//console.log(card.length);

//Parte da criação dos cards
function criandoDinamincamenteCards() {
    var image, nome, tipo, preco;
    var cards = document.getElementById('cards');
    for (var i = 0; i < quartos.length; i++) {
        nome = quartos[i]['name'];
        tipo = 'Tipo: ' + quartos[i]['property_type'];
        preco = 'R$ ' + quartos[i]['price'] + '/noite';
        image = quartos[i]['photo'];

        var divPrincipal = document.createElement("div");
        divPrincipal.setAttribute("class", "card col my-2");

        var divSecundaria = document.createElement("div");
        divSecundaria.setAttribute("class", "row no-gutters");

        var divImage = document.createElement("div");
        divImage.setAttribute("class", "col-md-4");

        var img = document.createElement('img');
        img.setAttribute('src', image);
        img.setAttribute('class', 'card-img');
        divImage.appendChild(img);
        divSecundaria.appendChild(divImage);

        var divTexto = document.createElement("div");
        divTexto.setAttribute("class", "col-md-8");

        var divCardBody = document.createElement("div");
        divCardBody.setAttribute("class", "card-body");

        var h5 = document.createElement("h5");
        h5.setAttribute('class', 'card-title');
        h5.innerHTML = nome;

        var pTipo = document.createElement("p");
        pTipo.setAttribute('class', 'card-text');
        pTipo.innerHTML = tipo;

        var pPreco = document.createElement("p");
        pPreco.setAttribute('class', 'card-text');
        pPreco.innerHTML = preco;

        var pTotal = document.createElement("p");
        pTotal.setAttribute('class', 'card-text');

        divCardBody.appendChild(h5);
        divCardBody.appendChild(pTipo);
        divCardBody.appendChild(pPreco);
        divCardBody.appendChild(pTotal);
        divTexto.appendChild(divCardBody);
        divSecundaria.appendChild(divTexto);
        divPrincipal.appendChild(divSecundaria);

        cards.appendChild(divPrincipal);
    }
    for (var i = 0; i < card.length; i++) {
        card[i].style.display = 'none';
    }
}

//Parte da criação dos tipos no select
function criandoOptions() {
    for (var i = 0; i < quartos.length; i++) {
        if (tipo.length == 0) {
            tipo.push(quartos[i]['property_type']);
        } else if (tipo.indexOf(quartos[i]['property_type']) == -1) {
            tipo.push(quartos[i]['property_type']);
        }
    }
    console.log(tipo);
    var select = document.getElementById('select_tipos');
    for (i = 0; i < tipo.length; i++) {
        option = document.createElement('option');
        option.value = i + 1;
        option.text = tipo[i];
        select.add(option);
    }
}

//Parte do codigo paginação
function criaPaginas() {
    var limite = parseInt(quartos.length / 6) + 1;
    var ul = document.getElementsByClassName('pagination');

    for (var i = 0; i <= limite; i++) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.setAttribute('class', 'page-link');
        a.setAttribute('href', '#');
        if (i == 0) {
            a.innerHTML = "<";
            a.setAttribute('onclick', 'mostraPag("-");');
            li.setAttribute('id', 'pag-prev');
        } else if (i == limite) {
            a.innerHTML = ">";
            a.setAttribute('onclick', 'mostraPag("+");');
            li.setAttribute('id', 'pag-next');
        } else {
            li.setAttribute('class', 'page-item pag');
            a.innerHTML = i;
            a.setAttribute('onclick', 'paginacao(' + i + ');');
        }
        li.appendChild(a);
        ul[0].appendChild(li);
    }

    paginacao(pagIni)
}
function paginacao(pag) {
    var pagNav = document.getElementsByClassName('pag');

    pagIni = pag;
    if (pag > pagNav.length) {
        pagIni = 1;
    }
    if (pag < 1) {
        pagIni = pagNav.length;
    }

    var min = 6 * (pagIni - 1);
    var max = 6 * pagIni - 1
    for (var i = 0; i < quartos.length; i++) {
        if (i >= min && i <= max) {
            card[i].style.display = 'block';
        }
        else {
            card[i].style.display = 'none';
        }
    }

    for (var i = 0; i < pagNav.length; i++) {
        if (i != (pagIni - 1)) {
            pagNav[i].classList.remove("active");
        }
        else {
            pagNav[i].classList.add("active");
        }
    }
}

function mostraPag(sinal) {
    if (sinal == '+') {
        paginacao(++pagIni);
    }
    else if (sinal == '-') {
        paginacao(--pagIni);
    }
}

function mostrarTipos() {
    var select = document.getElementById('select_tipos');

}