
function BookMark(id, nome, url, qtdVisitas){
    this.id = id;
    this.nome = nome;
    this.url = url;
    this.qtdVisitas = qtdVisitas;
}

var bookMarkList = [];
var bookMarkData;
var content;
var nome = '';
var lastQtdVisits = 0;

// Capturando botões
var addLink = document.getElementById("add-link");
var removeAll = document.getElementById("remove-all");

var saveBookMark = document.getElementById("btn-save");
var cancelModal = document.getElementById("btn-cancel");

var cancelEdit = document.getElementById("btn-cancel-edit");
var saveEdit = document.getElementById("btn-save-edit");

var inputBookmark = document.getElementById("new-bookmark-input");


function getTitle (url){
    let splitedUrl = url.split('/');
    let titleFull = '';


    titleFull = splitedUrl[1] + ' ' + splitedUrl[2];
    titleFull = titleFull.substring(0,20);

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
         console.table(bookMarkList); 
    } else {
        bookMarkList = [];
    }
    // setQtdVisitasZero();
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
    document.getElementById("popup-window").style.display = 'block';

});

cancelModal.addEventListener("click", function(e){
    document.getElementById("popup").style.display = 'none';
    inputBookmark.value = '';
    document.getElementById("popup-window").style.display = 'none';

});

// crud bookmark
function removeBookmark(event){
    let botao_remover = event.target;
      let botao_remover_dados = botao_remover.id.split('.');

      let cardAtual = 
          document.getElementById(botao_remover_dados[1]);

      content.removeChild(cardAtual);
      removeData(botao_remover_dados[1]);
}
document.querySelectorAll('.btn-rmv').forEach((el) =>
el.addEventListener('click', removeBookmark ));

function incrementQtdVisits(event){
    let link = event.target.parentElement.href;
    for (let i in bookMarkList){
        if(link == bookMarkList[i].url){
            bookMarkList[i].qtdVisitas++;
        }
    }    
    setBookMarkList(bookMarkList)
    showBookMarkList()
}

function setQtdVisitas(id){
    for(i in bookMarkList){
        if (id == bookMarkList[i].id){
            lastQtdVisits = bookMarkList[i].qtdVisitas;
        }
    }
}

function editBookMark(event){
    let botao_editar = event.target;
    let botao_editar_dados = botao_editar.id.split('.');
    setQtdVisitas(botao_editar.id.split('.')[1]);

    let cardAtual = 
        document.getElementById(botao_editar_dados[1]);

    document.getElementById("popup").style.display = 'flex';
    document.getElementById("popup-edit").style.display = 'block';

    bookMarkData = getDatabyId(botao_editar_dados[1]);

    document.getElementById("edit-bookmark-name")
        .value = bookMarkData.nome;
    document.getElementById("edit-bookmark-link")
        .value = bookMarkData.url;
}
document.querySelectorAll('.btn-edit').forEach((el) =>
el.addEventListener('click', editBookMark));

// removeAll.addEventListener('click', removeAllBookmarks);


cancelEdit.addEventListener('click', function(e){
  document.getElementById("popup")
      .style.display = 'none';
  document.getElementById("popup-edit")
      .style.display = 'none';

})

saveEdit.addEventListener('click', function(e){
    let newName = document.getElementById("edit-bookmark-name")
    .value;
    let newUrl = document.getElementById("edit-bookmark-link")
    .value;

    setData(bookMarkData.id, newName, newUrl, lastQtdVisits);
    lastQtdVisits = 0;

});


function getDatabyId(id){
    for (let i = 0; i < bookMarkList.length; i++){
        if (bookMarkList[i].id === id){
            return bookMarkList[i];
        }
    }
}

function setData(id, nome, url, qtdVisitas){
    let posicao;
    for (let i = 0; i < bookMarkList.length; i++){
        if (bookMarkList[i].id === id){
            posicao = i;
        }
    }
    bookMarkList[posicao].nome = nome;
    bookMarkList[posicao].url = url;
    bookMarkList[posicao].qtdVisitas = qtdVisitas;

    setBookMarkList();
    showBookMarkList();
    document.getElementById("popup")
        .style.display = 'none';
    document.getElementById("popup-edit")
        .style.display = 'none';
}


// crud

saveBookMark.addEventListener("click", function(e){
    let bookMark = inputBookmark.value;
    let bookMarkName = getTitle(bookMark);
    let id = createUuid();
    let newBookMark = 
    new BookMark(id, bookMarkName, bookMark, 0);

    let link = document.createElement('a');
    link.href = bookMark;

    if (bookMarkList == null){
        bookMarkList = [];
    }

    bookMarkList.push(newBookMark);
    setBookMarkList();
    let pos = bookMarkList.length - 1;
    init();
    inputBookmark.value = '';
    document.getElementById("popup").style.display = 'none';  
    document.getElementById("popup-window").style.display = 'none';
});


function showBookMarkList(){
    cleanBookMarkList();
    bookMarkList = JSON.parse(window.localStorage.getItem('bookMarkList'));
    bookMarkList.sort(function(a,b){
        return (a.qtdVisitas - b.qtdVisitas) * -1;
    });
    for (let item in bookMarkList){
        
        let id = bookMarkList[item].id;
        let nome = bookMarkList[item].nome;
        let url = bookMarkList[item].url;
        let qtdVisitas = bookMarkList[item].qtdVisitas;

        bookMarkList[item] = new BookMark(
            id,
            nome,
            url,
            qtdVisitas
        );

        createCard(bookMarkList[item]);
    }
    setBookMarkList();
}

function cleanBookMarkList(){

    while (content.firstChild) {
        content.removeChild(content.lastChild);
      }

}

function createCard(item){
    let link = document.createElement('a');
    link.href = item.url;
    link.target = '_blank';
    link.addEventListener('click', incrementQtdVisits)

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
    editButton.addEventListener('click', editBookMark);

    let removeButton = document.createElement('button');
    removeButton.innerHTML = 'excluir';
    removeButton.id = 'remove.' + item.id;
    removeButton.classList.add('btn-rmv');
    removeButton.classList.add('btn-ctrl');
    removeButton.addEventListener('click', removeBookmark);

    label.innerHTML = item.nome;

    cardContent.appendChild(label);
    link.appendChild(cardContent);
    card.appendChild(link);
    cardFooter.appendChild(editButton);
    cardFooter.appendChild(removeButton);
    card.appendChild(cardFooter);
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

function removeAllBookmarks (){
    bookMarkList = [];
    setBookMarkList();
    showBookMarkList();
}

function setQtdVisitasZero(){
    cleanBookMarkList();
    bookMarkList = JSON.parse(window.localStorage.getItem('bookMarkList'));
    for (let item in bookMarkList){
        
        let id = bookMarkList[item].id;
        let nome = bookMarkList[item].nome;
        let url = bookMarkList[item].url;
        // let qtdVisitas = bookMarkList[item].qtdVisitas;

        bookMarkList[item] = new BookMark(
            id,
            nome,
            url,
            0
        );

        // createCard(bookMarkList[item]);
    }
     setBookMarkList();
}
