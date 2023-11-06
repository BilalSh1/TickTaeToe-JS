const inputElem = document.getElementById("input-box");
const addButtonElem = document.getElementById("add-btn");
const todoParElem = document.getElementById("todo-list");

const todoList = [];
addButtonElem.addEventListener("click", function() {
    // todoList.push(inputElem.value);
    if (!inputElem.value){return;}
    todoParElem.innerHTML += inputElem.value + "</br>";
    inputElem.value = '';
})
