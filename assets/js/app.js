const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const itemFilter = document.getElementById('filter');
const clearButton = document.getElementById('item-clear');
const addElement = document.getElementById('addElement-button');
const formButton = itemForm.querySelector('button');
let isEditMode = false;

let elementsInTheList = [];

loadEventListeners();
function loadEventListeners(){
    //
    itemForm.addEventListener('submit',onAddItemSubmit);
    itemList.addEventListener('click',onClickItem);
    clearButton.addEventListener('click',deleteAllElementsFromList);
    itemFilter.addEventListener('input',filterItemsList);
    document.addEventListener('DOMContentLoaded', displayItems);

    checkUI();
}
function onAddItemSubmit(e){
    e.preventDefault();

    let newItem = itemInput.value;
    newItem = newItem.toLowerCase();
    newItem = newItem.charAt(0).toUpperCase() + newItem.slice(1);

    if( newItem === ''){
        alert('Por favor añada un elemento')
        return
    }

    //Revisamos si esta activo el modo edicion
    if(isEditMode){
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }else{
        if (checkIfItemExists(newItem)) {
            alert('Es item ya existe en la lista, introduzca otro!!');
            itemInput.value = '';
            return;
        }
    }

    checkUI();

    //Añadir elemento al DOM
    addItemToDom(newItem);

    //Añadir elemento al localStorage
    addItemToLocalStorage(newItem);

    itemInput.value = '';
}

function displayItems() {
    const itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.forEach(items=> addItemToDom(items));

    checkUI();
}

function addItemToDom(item){
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));//es como hacer el contenido de li
    li.classList.add('li-class');

    const button = createButton('remove-item');
    li.appendChild(button);

    //añadir li al DOM
    itemList.appendChild(li);
}

function addItemToLocalStorage(item){

    let itemsFromStorage = getItemsFromStorage();

    //Añadimos un nuevo elemento al array
    itemsFromStorage.push(item);
    
    localStorage.setItem('items',JSON.stringify(itemsFromStorage));
}

function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className=classes;
    return icon;
}

function deleteElementFromList(item){
    const text = item.firstChild.textContent.trim();
    if (confirm('¿Seguro que quieres eliminar "' + text + '" de la lista?')) {
        //Eliminar item del DOM
        item.remove();

        //Eliminar item del localStorage
        removeItemFromStorage(text);
        checkUI();
    }   
}

function deleteAllElementsFromList(){
    // Eliminar todos los elementos <li> del <ul>
    itemList.innerHTML = '';
    
    localStorage.removeItem('items');

    checkUI();


    // while(itemList.firstChild){
    //     itemList.removeChild(itemList.firstChild);
    // }
}

function checkUI(){

    itemInput.value = '';

    const items = itemList.querySelectorAll('li');

    if (items.length === 0) {
        clearButton.classList.add('hide-element');
        filter.classList.add('hide-element');
    }else{
        clearButton.classList.remove('hide-element');
        filter.classList.remove('hide-element');
    }

    formButton.innerHTML = '<i class="fa-solid fa-plus"></i>  Añadir';
    formButton.style.backgroundColor = '#333';

    isEditMode = false;
}

function filterItemsList(e){
    const items = itemList.querySelectorAll('li');
    const inputText = e.target.value.toLowerCase();

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(inputText) != -1) {
            item.style.display = 'flex';
        }else{
            item.style.display = 'none';
        }
    });
}

function getItemsFromStorage(){
    let itemsFromStorage;

    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    }else{
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

function onClickItem(e){
    const li = e.target.parentElement.parentNode;

    if(e.target.parentElement.classList.contains('remove-item')){
        deleteElementFromList(li);
    } else if(e.target.classList.contains('li-class')){
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item){
    const itemsFromStorage = getItemsFromStorage();
    item = item.toLowerCase();
    item = item.charAt(0).toUpperCase() + item.slice(1);
    return itemsFromStorage.includes(item);
}

function setItemToEdit(item){
    isEditMode = true;
    item.classList.add('edit-mode');
    formButton.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formButton.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
}

function removeItemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage();

    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    localStorage.setItem('items',JSON.stringify(itemsFromStorage));
}