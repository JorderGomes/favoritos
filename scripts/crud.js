
function BookMark(id, nome, url){
    this.id = id;
    this.nome = nome;
    this.url = url;
}

var bookMarkList = [];
var content;
var nome = '';

// Capturando botões
var addLink = document.getElementById("add-link");
var removeAll = document.getElementById("remove-all");

var saveBookMark = document.getElementById("btn-save");
var cancelModal = document.getElementById("btn-cancel");


var inputBookmark = document.getElementById("new-bookmark-input");

function getTitle (url){
    let splitedUrl = url.split('/');
    let titleFull = '';

    for (let i = splitedUrl.length; i >= 0; i--){
        if (splitedUrl[i] != undefined && splitedUrl[i] != ''){
            titleFull = splitedUrl[i];
            break;
        }
    }

    titleFull = titleFull.substring(0,25);

    return titleFull;
}

function createUuid(){
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function init(){
    content = document.getElementById('main-content');
    if (!!(window.localStorage.getItem('bookMarkList'))) {
        bookMarkList = JSON.parse(window.localStorage.getItem('bookMarkList'));
         console.log(bookMarkList); 
    } else {
        bookMarkList = [];
        //  console.log(bookMarkList);
    }
    // getTitle();
    showBookMarkList();
}
init();

function setBookMarkList(){
    window.localStorage.setItem('bookMarkList', JSON.stringify(bookMarkList));
}


// Adicionando gatilhos
// Flip modal 
addLink.addEventListener("click", function(e) {
    document.getElementById("popup").style.display = 'flex';
});

cancelModal.addEventListener("click", function(e){
    document.getElementById("popup").style.display = 'none';
    inputBookmark.value = '';
});

document.querySelectorAll('.btn-rmv').forEach((el) =>
  el.addEventListener('click', (event) => {
        let botao_remover = event.target;
        console.log(botao_remover.id);
        let botao_remover_dados = botao_remover.id.split('.');
        // console.log(botao_remover_dados);

        let cardAtual = 
            document.getElementById(botao_remover_dados[1]);

        content.removeChild(cardAtual);
        removeData(botao_remover_dados[1]);

  })
);

// crud

saveBookMark.addEventListener("click", function(e){
    let bookMark = inputBookmark.value;
    let bookMarkName = getTitle(bookMark);
    // console.log(nome);
    let id = createUuid();
    let newBookMark = 
    new BookMark(id, bookMarkName, bookMark);

    let link = document.createElement('a');
    link.href = bookMark;

    if (bookMarkList == null){
        bookMarkList = [];
    }

    bookMarkList.push(newBookMark);
    setBookMarkList();
    let pos = bookMarkList.length - 1;
    // createCard(id, bookMarkList.length - 1);
    createCard(bookMarkList[pos]);
    inputBookmark.value = '';
    document.getElementById("popup").style.display = 'none';    
});



// removeAll.addEventListener("click", function(e){
//     bookMarkList = [];
//     setBookMarkList();
// });

function showBookMarkList(){
    
    bookMarkList = JSON.parse(window.localStorage.getItem('bookMarkList'));
    for (let item in bookMarkList){
        // createCard(item);
        createCard(bookMarkList[item]);
    }

}

function createCard(uuid, item){
    // console.log(item);
    //  let uuid = createUuid();

    let link = document.createElement('a');
    link.href = bookMarkList[item].url;
    link.target = '_blank';

    let card = document.createElement('div');
    card.id = uuid;
    card.classList.add('card');

    let cardContent = document.createElement('div');
    cardContent.classList.add('card-content');

    let label = document.createElement('span');
    label.classList.add('label');

    let cardFooter = document.createElement('div');
    cardFooter.classList.add('card-footer');

    let editButton = document.createElement('button');
    editButton.innerHTML = 'editar';
    editButton.id = 'edit.' + uuid;
    editButton.classList.add('btn-edit');
    editButton.classList.add('btn-ctrl');


    let removeButton = document.createElement('button');
    removeButton.innerHTML = 'excluir';
    removeButton.id = 'remove.' + uuid;
    removeButton.classList.add('btn-rmv');
    removeButton.classList.add('btn-ctrl');


    label.innerHTML = bookMarkList[item].nome;

    cardContent.appendChild(label);
    link.appendChild(cardContent);
    card.appendChild(link);
    cardFooter.appendChild(editButton);
    cardFooter.appendChild(removeButton);
    card.appendChild(cardFooter);
    // link.appendChild(card);
    content.appendChild(card);
}

function createCard(item){
    // console.log(item);
    //  let uuid = createUuid();

    let link = document.createElement('a');
    link.href = item.url;
    link.target = '_blank';

    let card = document.createElement('div');
    card.id = item.id;
    card.classList.add('card');

    let cardContent = document.createElement('div');
    cardContent.classList.add('card-content');

    let label = document.createElement('span');
    label.classList.add('label');

    let cardFooter = document.createElement('div');
    cardFooter.classList.add('card-footer');

    let editButton = document.createElement('button');
    editButton.innerHTML = 'editar';
    editButton.id = 'edit.' + item.id;
    editButton.classList.add('btn-edit');
    editButton.classList.add('btn-ctrl');


    let removeButton = document.createElement('button');
    removeButton.innerHTML = 'excluir';
    removeButton.id = 'remove.' + item.id;
    removeButton.classList.add('btn-rmv');
    removeButton.classList.add('btn-ctrl');


    label.innerHTML = item.nome;

    cardContent.appendChild(label);
    link.appendChild(cardContent);
    card.appendChild(link);
    cardFooter.appendChild(editButton);
    cardFooter.appendChild(removeButton);
    card.appendChild(cardFooter);
    // link.appendChild(card);
    content.appendChild(card);
}

function removeData(uuid){
    let bookMarkListFiltred;
    bookMarkListFiltred = bookMarkList.filter(
        bookMarks => (bookMarks.id !== uuid)
    );
    bookMarkList = bookMarkListFiltred;
    setBookMarkList();
}
