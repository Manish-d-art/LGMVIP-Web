'use strict'

const toggleThemeBtn = document.querySelector('.logo');
const Body = document.querySelector('body');
const logo = document.querySelector('.logo');

//touch sounds
const switchThemeAudio = new Audio('https://www.fesliyanstudios.com/play-mp3/641');
const taskDoneAudio = new Audio();
taskDoneAudio.src="/assets/sounds/mixkit-select-click-1109 AETrim1668595932780.wav";
const removeTaskAudio = new Audio();
removeTaskAudio.src="/assets/sounds/removeSound.mp3";

toggleThemeBtn.addEventListener('click' ,function() {
  Body.classList.toggle('theme2');
  logo.classList.toggle('logo-toggle');
    switchThemeAudio.volume = .5;
    switchThemeAudio.play();
});

const form = document.querySelector('form');
const inputTask = document.querySelector('#TodoTextInput');
const taskCont = document.querySelector('.Todo-task__container');
const info = document.querySelectorAll('.Todo-status button');
const countList = document.querySelectorAll('.total-items-left'); 
const addBtnTop = document.querySelector('.check-logo-cont-top');

const display = function() {
  if(info[0].classList.contains('active')) {
    allStatus();
    infoHide();
    }

  if(info[1].classList.contains('active')) {
      const count = activeStatus();
      countList.forEach( ele => {
        ele.innerText = `${count} items left`;
      });
      infoHide();
      activeStatus();
    }

  if(info[2].classList.contains('active')) {
    infoHide();
    const count = completedTask();
    countList.forEach( ele => {
      ele.innerText = `${count} items left`;
    });
  }
}

//inserting task list in container
const formFunction = function() {
  const taskText = inputTask.value;
  if(taskText.trim()) {
  addTodo();
  display();
  totalTaskLeft();
  infoContainer.classList.remove('hideInfoContainer');
  infoContainer.classList.add('displayInfoContainer');
  infoMob.classList.remove('Todo-info-mob-toggle');
  }
}

//add Btn
addBtnTop.addEventListener('click', function() {
  formFunction();
});

//on submit
form.addEventListener('submit', function(e){
  e.preventDefault();
  formFunction();
});

// inserting task list 
const addTodo = function(Element) {
  const TodoList = document.createElement('div');
  TodoList.classList.add('Todo-list-cont');
  // TodoList.classList.add('draggables');
  let taskText = inputTask.value;
  if(Element) {
    taskText = Element.Text;
  }
  if(taskText) {
  TodoList.innerHTML = `
          <div class="Todo-list-sub-cont">
            <div class="cont">
              <button class="check-logo-cont ${Element && Element.complete ? "check-logo-cont-toggle":""}">
              <img class="check-logo" src="/assets/images/icon-check.svg" alt="check-logo">
              </button>
            </div>
            <p class="Todo-task ${Element && Element.complete ? "complete":""}">${taskText}</p>
          </div>
          <button class="cross-logo-cont">
            <img class="cross-logo" src="/assets/images/icon-cross.svg" alt="cross-logo">
          </button>
  `

  taskCont.prepend(TodoList);
  storeDataLs();

  //removeBtn/cross-logo
  const removeBtn = document.querySelector('.cross-logo-cont');
  removeBtn.addEventListener('click', function(){
    TodoList.remove();
    storeDataLs();
    display();
    totalTaskLeft();
    removeTaskAudio.volume="0.5";
    removeTaskAudio.play();
  });

  //check /mark done task
  const textTodo = document.querySelector('.Todo-task');
  const checkBtn = document.querySelector('.check-logo-cont');
  checkBtn.addEventListener('click', function() {
    const ele = checkBtn.closest('.check-logo-cont');
    ele.classList.toggle('check-logo-cont-toggle');
    textTodo.classList.toggle('complete');
    storeDataLs();
    display();
    totalTaskLeft();
    taskDoneAudio.volume=".5";
    taskDoneAudio.play();
   });
  }
  
  inputTask.value = "";
}


// saving data in localStorage
const storeDataLs = function() {
  let todos = document.querySelectorAll('.Todo-task');
  let arr = [];
  todos.forEach( Element => {
      arr.push ({
        Text : Element.innerText,
        complete : Element.classList.contains('complete')
      });
  });
  localStorage.setItem("todos",JSON.stringify(arr));
}

//getting data from localStorage
  let storageTodos = JSON.parse(localStorage.getItem("todos"));
  if(storageTodos) {
    storageTodos = storageTodos.reverse();
    storageTodos.forEach( ele => {
      addTodo(ele);
    });
  }

//event delegation 
const manageTodos = document.querySelector('.Todo-container__overflow');

const clearComplete = function() {
const todoList = document.querySelectorAll('.Todo-list-cont');
todoList.forEach( ele => { 
  if(ele.children[0].children[1].classList.contains('complete')){
    ele.remove();
    storeDataLs();
    removeTaskAudio.volume=".5";
    removeTaskAudio.play();
  }
}); 
}

// displays all tasks lists
const allStatus = function() {
const todoList = document.querySelectorAll('.Todo-list-cont');
  todoList.forEach( ele => {
    ele.style.display = 'flex';
  });
}

// display active task lists
const activeStatus = function() {
const todoList = document.querySelectorAll('.Todo-list-cont');
  todoList.forEach( ele => {
    if(!ele.children[0].children[1].classList.contains('complete')){
      ele.style.display = "flex";
    }
    else 
      ele.style.display = "none";
  });
}

// displays completed task lists
const completedTask = function() {
const todoList = document.querySelectorAll('.Todo-list-cont');

  todoList.forEach( ele => {
    if(ele.children[0].children[1].classList.contains('complete')) {
      ele.style.display = "flex";
    }
    else {
      ele.style.display = "none";
    }
  });
}
//total tasks left
const totalTaskLeft = function() {
  let count = 0;
  const countList = document.querySelectorAll('.total-items-left'); 
  const todoList = document.querySelectorAll('.Todo-list-cont');
  
    todoList.forEach( ele => {
      if(!ele.children[0].children[1].classList.contains('complete')) 
        count++;
    });
    countList.forEach( ele => {
      ele.innerText = `${count} items left`;
    });
}
totalTaskLeft();

//total tasks
const totalTasks = function() {
  let count = 0;
  const todoList = document.querySelectorAll('.Todo-list-cont');
  
    todoList.forEach( ele => {
        count++;
    });
    return count;
}
//handling footer part (all,active,completed)
manageTodos.addEventListener('click',function(e) {
  e.preventDefault();
  storeDataLs();
  if(e.target.classList.contains('clear-item')) {
    clearComplete();
    infoHide();
    allStatus();
    removeActiveClass();
    document.querySelector('.All-status').classList.add('active');
  }

  else if(e.target.classList.contains('All-status')) {
    removeActiveClass();
    e.target.classList.add('active');
    allStatus();
  }

  else if(e.target.classList.contains('Active-status')) {
    removeActiveClass();
    e.target.classList.add('active');
    activeStatus()
  }

  else if(e.target.classList.contains('Completed-status')) {
    removeActiveClass();
    e.target.classList.add('active');
    const count = activeStatus();
    completedTask();
  }

});

//remove active classes
const removeActiveClass = function() {
  const info = document.querySelectorAll('.Todo-status button');
  info.forEach( ele => 
    ele.classList.remove('active')
    );
}

//hide info
const infoContainer = document.querySelector('.Todo-status-container');
const infoMob = document.querySelector('.Todo-info-mob');
const infoHide = function() {
  if(totalTasks() === 0) {
    infoContainer.classList.remove('displayInfoContainer');
    infoContainer.classList.add('hideInfoContainer');
    infoMob.classList.add('Todo-info-mob-toggle');
  }
}
infoHide();

//theme indicator (displays one time only in your browser)
const themes = JSON.parse(localStorage.getItem("themeTimer")); 

//displays after 1 sec
const themeIndicator = document.querySelector('.themeIndicator');
 setTimeout( function() {
 themeIndicator.style.transform = `translateX(0px)`;
 themeIndicator.classList.add('themeDisplay');
},1000);

//hides after 4 sec
if(!themes) {
  setTimeout( function() {
    themeIndicator.classList.remove('themeDisplay');
    document.querySelector('.themeIndicator').classList.add('themeHide');
    themeLS();
  },4000);
}
else {
  document.querySelector('.themeIndicator').remove();
}

//setting theme indicator hide in Ls
const themeLS = function() {
  const arr = [];
  arr.push({
      key:"theme",
      time:"sec",
    });
    localStorage.setItem("themeTimer",JSON.stringify(arr));
}
