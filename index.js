const submitBtn = document.getElementById('submit');
const clearTextBtn = document.getElementById('clear-text');
const deleteAllBtn = document.getElementById('delete-all');
const todoArea = document.getElementById('todo-input');
const todoContainer = document.getElementById('todo-ctnr');
let todoItems;
let todoDeleteBtns;

let todoItemCount = 0;

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
	localStorage.setItem(
		'todo',
		JSON.stringify({ todos: todoList.filter(todo => todo) })
	);
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
	deleteBtn.setAttribute('id', `del-${todoItemCount++}`);

	deleteBtn.addEventListener('click', e => {
		e.target.parentElement.remove();
		todoList[Number(e.target.id.split('-')[1])] = null;
		localStorage.setItem(
			'todo',
			JSON.stringify({ todos: todoList.filter(todo => todo) })
		);
	});

	element.appendChild(deleteBtn);
}
