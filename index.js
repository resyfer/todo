//* Elements
const submitBtn = document.getElementById('submit'); //* Btn : Add
const clearTextBtn = document.getElementById('clear-text'); //* Btn: Clear Text
const deleteAllBtn = document.getElementById('delete-all'); //* Btn : Delete All
const todoArea = document.getElementById('todo-input'); //* Textarea for todo
const todoContainer = document.getElementById('todo-ctnr'); //* Container for todo items

//* Counters
let todoItemCount = 0;

/**
 * *Check if localStorage is empty or not.
 * *If empty, set a default empty array value.
 */
if (!localStorage.getItem('todo')) {
	localStorage.setItem('todo', JSON.stringify({ todos: [] }));
	/**
	 * todo = {
	 * 		value
	 * 		checked
	 * }
	 */
	localStorage.setItem('visit', 0);
}
//* Increment visits
localStorage.setItem('visit', Number(localStorage.getItem('visit')) + 1);

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
			value: todoList[i].value,
			checked: todoList[i].checked,
		});
	}
})();

/* First Time Message */
/**
 * *Listener for closing parent element on clicking X for first time messgae
 */
let crossList = document.getElementsByClassName('fa-times');
for (let i = 0; i < crossList.length; i++) {
	crossList[i].addEventListener('click', e => {
		e.target.parentElement.style.display = 'none';

		if (i == 0) todoArea.focus(); //* Adds focus on todo area if closing first time msg
	});
}

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
	localStorage.setItem('visit', Number(localStorage.getItem('visit')) - 1); //* To nullify the extra revisit on reload
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

	todoList.push({
		value: todoValue.toString(),
		checked: false,
	});
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
 * @params checked : boolean value for checked or not
 */
function makeTodoElement({ container, element, value, checked = false }) {
	element.setAttribute('class', 'todo-itm');
	element.setAttribute('id', `todo-itm-${todoItemCount}`);

	/* Check Btn */
	let checkBtn = document.createElement('label');

	let checkBox = document.createElement('input');
	checkBox.setAttribute('type', 'checkbox');
	checkBox.setAttribute('class', 'checkbox');
	checkBox.checked = checked;
	checkBtn.appendChild(checkBox);

	let checkSpan = document.createElement('span');
	checkSpan.setAttribute('class', 'check-span');
	checkBtn.appendChild(checkSpan);

	checkBtn.setAttribute('class', 'check-ctnr');

	/* Text */
	let todoText = document.createElement('div');
	todoText.setAttribute('class', 'todo-text');
	todoText.innerText = value;
	/* Initial Load */
	if (checked) {
		todoText.style.textDecoration = 'line-through double';
		todoText.style.color = 'var(--theme1-050)';
	} else {
		todoText.style.textDecoration = 'none';
		todoText.style.color = 'var(--theme1-100)';
	}

	/* Check Btn Event Listener */
	checkBtn.addEventListener('click', e => {
		todoList[
			Number(e.target.parentElement.parentElement.id.split('-')[2])
		].checked = e.target.checked;
		if (e.target.checked) {
			todoText.style.textDecoration = 'line-through double';
			todoText.style.color = 'var(--theme1-050)';
		} else {
			todoText.style.textDecoration = 'none';
			todoText.style.color = 'var(--theme1-100)';
		}
		localStorage.setItem(
			'todo',
			JSON.stringify({ todos: todoList.filter(todo => todo) })
		);
	});

	/* Delete Btn */
	//* Delete Btn Addition
	let deleteBtn = document.createElement('i');
	deleteBtn.setAttribute('class', 'fas fa-trash todo-itm-del');
	deleteBtn.setAttribute('id', `del-${todoItemCount}`);

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

	/* Appending elements in order */
	element.appendChild(checkBtn);
	element.appendChild(todoText);
	element.appendChild(deleteBtn);

	container.appendChild(element);

	/* Item Counter */
	todoItemCount++;
}

/* Quality of Life features */

/**
 * *Add focus to Todo Area on window load
 */
window.onload = () => {
	todoArea.focus();
};

/**
 * *Ctrl + Enter to add Todo while focus on Todo Area
 */
window.addEventListener('keydown', e => {
	if (document.activeElement === todoArea && e.code === 'Enter' && e.ctrlKey) {
		e.preventDefault();
		submitBtn.click();
	}
});

/**
 * *First Time Message
 */
if (Number(localStorage.getItem('visit')) == 1) {
	document.getElementById('first-time').style.display = 'flex';
}
