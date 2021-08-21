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

submitBtn.addEventListener('click', e => {
	e.preventDefault();
	if (todoArea.value) addTodo(todoArea.value);
	todoArea.value = '';

	todoContainer.scrollTo(0, todoContainer.scrollHeight);
});

clearTextBtn.addEventListener('click', e => {
	e.preventDefault();
	todoArea.value = '';
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
