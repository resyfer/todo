//* Elements
const submitBtn = document.getElementById('submit'); //* Btn : Add
const clearTextBtn = document.getElementById('clear-text'); //* Btn: Clear Text
const deleteAllBtn = document.getElementById('delete-all'); //* Btn : Delete All
const todoArea = document.getElementById('todo-input'); //* Textarea for todo
const todoContainer = document.getElementById('todo-ctnr'); //* Conatiner for todo items

//* Counters
let todoItemCount = 0;

/**
 * *Check if localStorage is empty or not.
 * *If empty, set a default empty array value.
 */
if (!localStorage.getItem('todo'))
	localStorage.setItem('todo', JSON.stringify({ todos: [] }));

/**
 * *Get list of todos from localStorage
 * !as todoList
 */
let { todos: todoList } = JSON.parse(localStorage.getItem('todo'));

/**
 * *Display existing TODOs
 */
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

//* Add TODO
submitBtn.addEventListener('click', e => {
	e.preventDefault();

	if (todoArea.value) addTodo(todoArea.value);
	todoArea.value = ''; //* Empty TODO Area

	todoContainer.scrollTo(0, todoContainer.scrollHeight); //* Scroll to bottom of TODOs
});

//* Clear text in TODO Area
clearTextBtn.addEventListener('click', e => {
	e.preventDefault();
	todoArea.value = '';
	todoArea.focus();
});

//* Remove all todos
deleteAllBtn.addEventListener('click', e => {
	e.preventDefault();
	localStorage.setItem('todo', JSON.stringify({ todos: [] }));
	location.reload();
});

//* Add a new Todo
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
		/**
		 * *Removes null values from todoList from deletions
		 */
	);
}

/**
 * @params container : Parent Element
 * @params element : new element from createElement
 * @params value : innerText value
 */
function makeTodoElement({ container, element, value }) {
	element.setAttribute('class', 'todo-itm');
	element.innerText = value;
	container.appendChild(element);

	addChangeOptions({ element });
	/**
	 * *Adds todo update options
	 */
}

function addChangeOptions({ element }) {
	//* Delete Btn Addition
	let deleteBtn = document.createElement('i');
	deleteBtn.setAttribute('class', 'fas fa-trash todo-itm-del');
	deleteBtn.setAttribute('id', `del-${todoItemCount++}`);

	//* Delete Event Listener
	deleteBtn.addEventListener('click', e => {
		e.target.parentElement.remove();
		todoList[Number(e.target.id.split('-')[1])] = null;
		localStorage.setItem(
			'todo',
			JSON.stringify({ todos: todoList.filter(todo => todo) })
		);
		/**
		 * ?The IDs are of form del-i
		 * !Splitting and taking i and setting todoList[i] = null;
		 * *todoList holds null values till the session lasts
		 * ?Easier for deletion of todos, deletions using todoList
		 * !localStorage doesn't store null values due of filter
		 * *New ids and todoList values are assigned from localStorage for new session
		 */
	});

	element.appendChild(deleteBtn);
}

/* Quality of Life features */

/*
 * Add focus to Todo Area on window load
 */
window.onload = () => {
	todoArea.focus();
};

/*
 * Enter to add Todo
 * Shift + Enter for new line
 */
window.addEventListener('keydown', e => {
	if (document.activeElement === todoArea && e.code === 'Enter') {
		e.preventDefault();
		submitBtn.click();
	}
});
