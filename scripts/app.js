// Construtor bookmark
function BookMark(id, name, url, visitCount){
    this.id = id;
    this.name = name;
    this.url = url;
    this.visitCount = visitCount;
}

// Variaveis globais
var bookMarkList = [];
var bookMarkData;
var content;
var name = '';
var lastVisitCount = 0;
var targetBookmarkId = "";

// Capturando botões
var addLink = document.getElementById("add-link");
var removeAll = document.getElementById("remove-all");

var saveBookMark = document.getElementById("btn-save");
var cancelModal = document.getElementById("btn-cancel");

var cancelEdit = document.getElementById("btn-cancel-edit");
var saveEdit = document.getElementById("btn-save-edit");
var cancelRemove = document.getElementById("btn-cancel-remove");
var btnRemoveBookMark = document.getElementById("btn-remove-fav");

var inputBookmark = document.getElementById("new-bookmark-input");

// Funções utilitárias
function getTitle(url) {
    return url.split('.')[1];
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
    showBookMarkList();
}
init();

function setBookMarkList(){
    window.localStorage.setItem('bookMarkList', JSON.stringify(bookMarkList));
}

function showPopupWindow() {
    document.getElementById("popup").style.display = 'flex';
    document.getElementById("popup-window").style.display = 'block';
}

function hidePopupWindow() {
    inputBookmark.value = '';
    document.getElementById("popup").style.display = 'none';
    document.getElementById("popup-window").style.display = 'none';
}

// Adicionar favoritos
// Create
addLink.addEventListener("click", showPopupWindow);
cancelModal.addEventListener("click", hidePopupWindow); 

function setData(id, name, url, visitCount){
    let posicao;
    for (let i = 0; i < bookMarkList.length; i++){
        if (bookMarkList[i].id === id){
            posicao = i;
        }
    }
    bookMarkList[posicao].name = name;
    bookMarkList[posicao].url = url;
    bookMarkList[posicao].visitCount = visitCount;

    setBookMarkList();
    showBookMarkList();
    document.getElementById("popup").style.display = 'none';
    document.getElementById("popup-edit").style.display = 'none';
}

saveBookMark.addEventListener("click", function(e){
    let bookMark = inputBookmark.value;
    let bookMarkName = getTitle(bookMark);
    let id = createUuid();
    let newBookMark = new BookMark(id, bookMarkName, bookMark, 0);

    let link = document.createElement('a');
    link.href = bookMark;

    if (bookMarkList == null){
        bookMarkList = [];
    }

    bookMarkList.push(newBookMark);
    setBookMarkList();
    // let pos = bookMarkList.length - 1;
    init();
    hidePopupWindow();
});

// Read

function getDatabyId(id){
    for (let i = 0; i < bookMarkList.length; i++){
        if (bookMarkList[i].id === id){
            return bookMarkList[i];
        }
    }
}

function cleanBookMarkList(){
    while (content.firstChild) {
        content.removeChild(content.lastChild);
    }
}

function createCard(item) {
    const card = document.createElement('div');
    card.id = item.id;
    card.classList.add('card');
    card.innerHTML = `
        <a class="link" href="${item.url}" target="_blank" onclick="incrementQtdVisits('${item.id}')">
            <div class="card-content"><span class="label">${item.name}</span></div>
        </a>
        <div class="card-footer">
            <button id="edit.${item.id}" class="btn-edit btn-ctrl">editar</button>
            <button id="remove.${item.id}" class="btn-rmv btn-ctrl">excluir</button>
        </div>
    `;
    content.appendChild(card);
}

function showBookMarkList(){
    cleanBookMarkList();
    bookMarkList = JSON.parse(window.localStorage.getItem('bookMarkList')) || [];
    bookMarkList.sort(function(a,b){
        return (a.visitCount - b.visitCount) * -1;
    });
    for (let item in bookMarkList){
        
        let id = bookMarkList[item].id;
        let name = bookMarkList[item].name;
        let url = bookMarkList[item].url;
        let visitCount = bookMarkList[item].visitCount;

        bookMarkList[item] = new BookMark(id, name, url, visitCount);

        createCard(bookMarkList[item]);
    }
    setBookMarkList();
}

// Update
function showPopupEdit() {
    document.getElementById("popup").style.display = 'flex';
    document.getElementById("popup-edit").style.display = 'block';
}

function incrementQtdVisits(id){
    const bookmark = bookMarkList.find(item => item.id === id);
    if (bookmark) {
        bookmark.visitCount++;
        setBookMarkList(bookMarkList);
        showBookMarkList();
    }
}

function setvisitCount(id){
    for(i in bookMarkList){
        if (id == bookMarkList[i].id){
            lastVisitCount = bookMarkList[i].visitCount;
        }
    }
}

function editBookMark(event){
    let botao_editar = event.target;
    let botao_editar_dados = botao_editar.id.split('.');

    setvisitCount(botao_editar.id.split('.')[1]);

    showPopupEdit();

    bookMarkData = getDatabyId(botao_editar_dados[1]);

    document.getElementById("edit-bookmark-name").value = bookMarkData.name;
    document.getElementById("edit-bookmark-link").value = bookMarkData.url;
}

document.querySelectorAll('.btn-edit').forEach((el) =>
el.addEventListener('click', editBookMark));

saveEdit.addEventListener('click', function(e){
    let newName = document.getElementById("edit-bookmark-name").value;
    let newUrl = document.getElementById("edit-bookmark-link").value;

    setData(bookMarkData.id, newName, newUrl, lastVisitCount);
    lastVisitCount = 0;
});

cancelEdit.addEventListener('click', function(e){
  document.getElementById("popup").style.display = 'none';
  document.getElementById("popup-edit").style.display = 'none';
})

// Delete
function showDeletePopup() {
    document.getElementById("popup").style.display = 'flex';
    document.getElementById("popup-delete").style.display = 'block';
}

function hideDeletePopup(params) {
    document.getElementById("popup").style.display = 'none';
    document.getElementById("popup-delete").style.display = 'none';
}

function removeData(uuid){
    let bookMarkListFiltred;
    bookMarkListFiltred = bookMarkList.filter(
        bookMarks => (bookMarks.id !== uuid)
    );
    bookMarkList = bookMarkListFiltred;
    setBookMarkList();
}

function handleDeleteClick(event){
    showDeletePopup();
    let deleteBtn = event.target;
    targetBookmarkId = deleteBtn.id.split('.')[1];
}

document.querySelectorAll('.btn-rmv').forEach((el) =>
el.addEventListener('click', handleDeleteClick));

btnRemoveBookMark.addEventListener('click', removeBookmark)
function removeBookmark(event){
    let currentCard = document.getElementById(targetBookmarkId);
    
    content.removeChild(currentCard);
    removeData(targetBookmarkId);
    hideDeletePopup();
}

cancelRemove.addEventListener('click', function (e) {
    hideDeletePopup();
})

// Delete All
function removeAllBookmarks (){
    bookMarkList = [];
    setBookMarkList();
    showBookMarkList();
}

function resetVisitCount(){
    cleanBookMarkList();
    bookMarkList = JSON.parse(window.localStorage.getItem('bookMarkList'));
    for (let item in bookMarkList){
        let id = bookMarkList[item].id;
        let name = bookMarkList[item].name;
        let url = bookMarkList[item].url;
        bookMarkList[item] = new BookMark(id, name, url, 0 );

    }
     setBookMarkList();
}