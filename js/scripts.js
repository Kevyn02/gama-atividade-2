var pagIni = 1;
var quartos, quartoResp;
var tipo = [];

//Pegando a base de dados
var requestURL = 'https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72';
var request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function () {
    quartos = request.response;
    quartoResp = quartos;
    criandoOptions();
    mostrarTipos();
}

//Parte da criação dos cards
function criandoDinamincamenteCards() {
    var image, nome, tipo, preco;
    var cards = document.getElementById('cards');
    var divCards = document.getElementsByClassName('card');
    var tamanho = divCards.length;
    if (tamanho > 0) {
        for (var i = tamanho - 1; i >= 0; i--) {
            divCards[i].remove();
        }
    }

    for (var i = 0; i < quartoResp.length; i++) {
        nome = quartoResp[i]['name'];
        tipo = 'Tipo: ' + quartoResp[i]['property_type'];
        preco = 'R$ ' + quartoResp[i]['price'] + '/noite';
        image = quartoResp[i]['photo'];

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
        pPreco.setAttribute('class', 'card-text preco');
        pPreco.innerHTML = preco;

        var pTotal = document.createElement("p");
        pTotal.setAttribute('class', 'card-text total');

        divCardBody.appendChild(h5);
        divCardBody.appendChild(pTipo);
        divCardBody.appendChild(pPreco);
        divCardBody.appendChild(pTotal);
        divTexto.appendChild(divCardBody);
        divSecundaria.appendChild(divTexto);
        divPrincipal.appendChild(divSecundaria);

        cards.appendChild(divPrincipal);
    }
    mostrarTotal();
}

//Parte da criação dos tipos no select
function criandoOptions() {
    for (var i = 0; i < quartoResp.length; i++) {
        if (tipo.length == 0) {
            tipo.push(quartoResp[i]['property_type']);
        } else if (tipo.indexOf(quartoResp[i]['property_type']) == -1) {
            tipo.push(quartoResp[i]['property_type']);
        }
    }
    var select = document.getElementById('select_tipos');
    for (i = 0; i < tipo.length; i++) {
        option = document.createElement('option');
        option.value = tipo[i];
        option.text = tipo[i];
        select.add(option);
    }
}

//Parte do codigo paginação
function criaPaginas() {
    var limite = parseInt(quartoResp.length / 6) + 1;
    if (parseInt(quartoResp.length % 6) > 0) {
        limite += 1;
    }
    var nav = document.getElementById('nav-pagination');
    var ul = document.getElementsByClassName('pagination');
    if (ul.length == 1) {
        ul[0].remove();
    }
    ul = document.createElement('ul');
    ul.setAttribute('class', 'pagination');

    if (limite > 1) {
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
            ul.appendChild(li);
        }
    }
    nav.appendChild(ul);
    paginacao(pagIni)
}

function paginacao(pag) {
    var pagNav = document.getElementsByClassName('pag');
    var card = document.getElementsByClassName('card');
    pagIni = pag;
    if (pag > pagNav.length) {
        pagIni = 1;
    }
    if (pag < 1) {
        pagIni = pagNav.length;
    }

    var min = 6 * (pagIni - 1);
    var max = 6 * pagIni - 1
    for (var i = 0; i < quartoResp.length; i++) {
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

//Parte do codigo para mostra cards de acordo com o tipo selecionado
var select = document.getElementById('select_tipos');
function mostrarTipos() {
    var selectTipo = select.value;
    quartoResp = [];
    if (selectTipo == 'todos') {
        quartoResp = quartos;
    }
    else {
        for (var i = 0; i < quartos.length; i++) {
            if (quartos[i]['property_type'] == selectTipo) {
                quartoResp.push(quartos[i]);
            }
        }
    }

    criandoDinamincamenteCards();
    criaPaginas();
}

//Parte do codigo para calcular a estadia de acordo com os dias escolhidos
function calculaData(dataEntrada, dataSaida) {
    dataEntrada = new Date(dataEntrada);
    dataEntrada.setDate(dataEntrada.getDate() + 1);
    console.log(dataEntrada);


    dataSaida = new Date(dataSaida);
    dataSaida.setDate(dataSaida.getDate() + 1);
    console.log(dataSaida);

    var diferenciaTempo = dataSaida.getTime() - dataEntrada.getTime();
    return parseInt(diferenciaTempo / (1000 * 3600 * 24));
}

function mostrarTotal() {
    var dataEntrada = document.getElementById('data_entrada').value;
    var dataSaida = document.getElementById('data_saida').value;
    if (dataEntrada != "" && dataSaida != "") {
        var preco = document.getElementsByClassName('preco');
        var total = document.getElementsByClassName('total');
        var resultado = 0;
        var texto;

        var diferenciaDias = calculaData(dataEntrada, dataSaida);
        console.log(diferenciaDias);
        if (diferenciaDias <= 0) {
            alert('Selecione as data corretamente!');
            for (var i = 0; i < preco.length; i++) {
                total[i].innerHTML = "";
            }
        } else {
            for (var i = 0; i < preco.length; i++) {
                texto = preco[i].innerHTML.replace('/noite', '');
                texto = texto.replace('R$ ', '');
                resultado = parseFloat(texto) * diferenciaDias
                total[i].innerHTML = 'Dias: ' + diferenciaDias + ', Total: R$' + resultado.toFixed(2).replace('.', ',');
            }
        }
    }

}
