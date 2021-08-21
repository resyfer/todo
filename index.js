const submitBtn = document.getElementById('submit');
const clearTextBtn = document.getElementById('clear-text');
const deleteAllBtn = document.getElementById('delete-all');
const todoArea = document.getElementById('todo-input');
const todoContainer = document.getElementById('todo-ctnr');
let todoItems;
let todoDeleteBtns;

if (!localStorage.getItem('todo'))
	localStorage.setItem('todo', JSON.stringify({ todos: [] }));

let { todos: todoList } = JSON.parse(localStorage.getItem('todo'));

(() => {
	for (let i = 0; i < todoList.length; i++) {
		let todoElement = document.createElement('div');
		makeTodoElement({
			container: todoContainer,
			element: todoElement,
			value: todoList[i],
		});
	}
})();

addDeleteListeners();

submitBtn.addEventListener('click', e => {
	e.preventDefault();
	if (todoArea.value) addTodo(todoArea.value);
	todoArea.value = '';

	addDeleteListeners();

	todoContainer.scrollTo(0, todoContainer.scrollHeight);
});

clearTextBtn.addEventListener('click', e => {
	e.preventDefault();
	todoArea.value = '';
});

deleteAllBtn.addEventListener('click', e => {
	e.preventDefault();
	localStorage.setItem('todo', JSON.stringify({ todos: [] }));
	location.reload();
});

function addTodo(todoValue) {
	let todoNew = document.createElement('div');

	makeTodoElement({
		container: todoContainer,
		element: todoNew,
		value: todoValue,
	});

	todoList.push(todoValue.toString());
	localStorage.setItem('todo', JSON.stringify({ todos: todoList }));
}

function addDeleteListeners() {
	todoItems = document.getElementsByClassName('todo-itm');
	todoDeleteBtns = document.getElementsByClassName('todo-itm-del');

	removeDeleteListeners('click');

	for (let i = 0; i < todoDeleteBtns.length; i++) {
		todoDeleteBtns[i].addEventListener('click', deleteTodo);
	}
}

function removeDeleteListeners() {
	for (let i = 0; i < todoDeleteBtns.length; i++) {
		todoDeleteBtns[i].removeEventListener('click', deleteTodo);
	}
}

function deleteTodo(e) {
	// todoList.splice(i, 1);
	// e.target.parentElement.remove();
	// localStorage.setItem('todo', JSON.stringify({ todos: todoList }));
	// addDeleteListeners();

	console.log(e);
}

function makeTodoElement({ container, element, value }) {
	element.setAttribute('class', 'todo-itm');
	element.innerText = value;
	container.appendChild(element);

	addChangeOptions({ element });
}

function addChangeOptions({ element }) {
	let deleteBtn = document.createElement('i');
	deleteBtn.setAttribute('class', 'fas fa-trash todo-itm-del');
	element.appendChild(deleteBtn);
}
