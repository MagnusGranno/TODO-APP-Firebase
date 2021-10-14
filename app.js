import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  deleteDoc,
} from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-analytics.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyDLCIlPSbXvLPfZ9rYJr--0mRrJko1pZWQ',
  authDomain: 'todo-619c2.firebaseapp.com',
  projectId: 'todo-619c2',
  storageBucket: 'todo-619c2.appspot.com',
  messagingSenderId: '719431243620',
  appId: '1:719431243620:web:874ecf7cf386ddcb508c71',
  measurementId: 'G-98TN973FHL',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();

window.onload = windowLoaded();

function windowLoaded() {
  readFromDB();
  showTaskLeft();
}
const form = document.getElementById('form');

// State of viewing
let state = 0;

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let text = document.getElementById('input_text');
  addToDB(text.value);
  text.value = '';
  readFromDB();
});

function addToDB(todoText) {
  const docRef = addDoc(collection(db, 'todo-items'), {
    text: todoText,
    status: 'active',
  });
  console.log('Document written with ID: ', docRef.id);
}

async function readFromDB() {
  const todoDocs = await getDocs(collection(db, 'todo-items'));
  let todos = [];
  todoDocs.forEach((doc) => {
    todos.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  state = 0;
  generateTodos(todos);
  showTaskLeft();
}

function generateTodos(todos) {
  let todosHTML = '';
  todos.forEach((todo) => {
    todosHTML += `
    <div class="todo_item">
      <div class="check">
        <div data-id="${todo.id}" id="${todo.id}"class="check_mark ${todo.status}">
            <img src="./Images/icon-check.svg" alt="">
        </div>
      </div>
      <div class="todo_text ${todo.status}">
        ${todo.text}
      </div>
    </div>
    
    `;
  });
  document.querySelector('.todo_items').innerHTML = todosHTML;
  createEventListeners();
}
function createEventListeners() {
  let checkMarks = document.querySelectorAll('.todo_item .check_mark');
  checkMarks.forEach((checkMark) => {
    checkMark.addEventListener('click', () => {
      markAsCompleted(checkMark.dataset.id);
    });
  });
}

async function markAsCompleted(id) {
  document.getElementById(id).style.background = `linear-gradient(
    188deg,
    rgb(5, 90, 253) 15%,
    rgb(130, 183, 178) 95%
  );`;
  const updateRef = doc(db, 'todo-items', id);

  let isStatus = document.getElementById(id).classList.contains('completed');

  if (isStatus) {
    await updateDoc(updateRef, {
      status: 'active',
    });
  } else if (!status) {
    await updateDoc(updateRef, {
      status: 'completed',
    });
  }

  switch (state) {
    case 0:
      readFromDB();
      break;
    case 1:
      showActive();
      break;
    case 2:
      showCompleted();
      break;
  }
}

const spans = document.querySelectorAll('.toggle');

spans.forEach((span) => {
  span.addEventListener('click', (e) => {
    document.querySelector('.toggled').classList.remove('toggled');
    e.currentTarget.classList.add('toggled');
    if (e.currentTarget.id === 'active') {
      showActive();
    } else if (e.currentTarget.id == 'completed') {
      showCompleted();
    } else {
      readFromDB();
    }
  });
});

async function showActive() {
  const q = query(
    collection(db, 'todo-items'),
    where('status', '==', 'active')
  );
  const todoDocs = await getDocs(q);
  let activeTodos = [];
  todoDocs.forEach((doc) => {
    activeTodos.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  state = 1;
  generateTodos(activeTodos);
  showTaskLeft();
}

async function showCompleted() {
  const q = query(
    collection(db, 'todo-items'),
    where('status', '==', 'completed')
  );
  const todoDocs = await getDocs(q);
  let completedTodos = [];
  todoDocs.forEach((doc) => {
    completedTodos.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  state = 2;
  generateTodos(completedTodos);
  showTaskLeft();
}

const clearCompleted = document.getElementById('clear_completed');

clearCompleted.addEventListener('click', () => {
  const completedTodos = document.querySelectorAll('.check_mark.completed');
  completedTodos.forEach((todo) => {
    let deleteRef = doc(db, 'todo-items', todo.dataset.id);
    deleteDoc(deleteRef);
  });
  switch (state) {
    case 0:
      readFromDB();
      break;
    case 1:
      showActive();
      break;
    case 2:
      showCompleted();
      break;
  }
  showTaskLeft();
});

async function showTaskLeft() {
  let activeTasks = 0;
  const qu = query(
    collection(db, 'todo-items'),
    where('status', '==', 'active')
  );
  const todoDocs = await getDocs(qu);
  todoDocs.forEach((doc) => activeTasks++);

  let completedTasks = 0;
  const quq = query(
    collection(db, 'todo-items'),
    where('status', '==', 'completed')
  );
  const todoDocsCom = await getDocs(quq);
  todoDocsCom.forEach((doc) => completedTasks++);

  const taskLeft = document.getElementById('tasksLeft');
  taskLeft.textContent = `${activeTasks} active | ${completedTasks} completed`;
}

//TODO: 1. fix items left in the bottom left corner 2. make responsive 3. change themes
