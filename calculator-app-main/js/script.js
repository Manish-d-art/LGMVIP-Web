'use strict'

const switchOpts = document.querySelectorAll('.btnOptions');
const toggleSwitchBtn = document.querySelector('.toggleBtn');
const bodyy = document.querySelector('body');

const numsBtn = document.querySelectorAll('.numBtn');
const operatorBtn = document.querySelectorAll('.operationBtn');
const equalsBtn = document.querySelector('.equalesBtn');
const deleteBtn = document.querySelector('.delBtn');
const resetBtn = document.querySelector('.resetBtn');
const previousOperationText = document.querySelector('.previous-operand');
const currentOperationText = document.querySelector('.current-operand');

//sounds
const switchThemeAudio = new Audio('https://www.fesliyanstudios.com/play-mp3/641');
const btnAudio = new Audio();
btnAudio.src="/assets/sounds/button-sound-numpad.wav";

const totalSwitches = switchOpts.length;
let currSwitch = 1;

const goToBtn = function(val) {
  toggleSwitchBtn.style.transform = `translateX(${18*val}px)`;
}

switchOpts.forEach(function(ele) {
  ele.addEventListener('click', function(e) {
    if (e.target.classList.contains('btnOptions')) {
      const TargetBtn = +e.target.dataset.index;
      bodyy.removeAttribute('class');
      bodyy.classList.toggle(`theme${TargetBtn}`);
      goToBtn(TargetBtn);
      currSwitch = TargetBtn;
      switchThemeAudio.volume = ".1";
      switchThemeAudio.play();
    }
    return;
  });

});
//calculation

class Calculator {
  constructor(previousOperationText, currentOperationText){
    this.previousOperationText = previousOperationText;
    this.currentOperationText = currentOperationText;
    this.clear();
  }

  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined ;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number){
    if (number === '.' && this.currentOperand.includes('.')) return;
    if(number === '.' && this.currentOperand === ''){
      this.currentOperand = this.currentOperand.toString() +"0"+ number.toString();
      return;
    }
    this.currentOperand = this.currentOperand.toString() + number.toString();
  
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return;
    if (this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand ;
    this.currentOperand = '';
    btnAudio.volume=".1";
    btnAudio.play();
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '/':
        computation = prev / current;
        break;
      default:
        return;
    }
    this.currentOperand = '' + Math.round((computation + Number.EPSILON) * 100) / 100;
    this.operation = undefined;
    this.previousOperand = '';
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;
    if ( isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', {
        maximumFractionDigits: 0
      })
    }
    if ( decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay ;
    }
  }
  updateDisplay() {
    this.currentOperationText.innerText = this.getDisplayNumber(this.currentOperand);
    if (this.operation != null){
      this.previousOperationText.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`; ;
    }
    else {
      this.previousOperationText.innerText = '';
    }
  }
}

const calculator = new Calculator(previousOperationText, currentOperationText);

numsBtn.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
    btnAudio.volume=".1";
    btnAudio.play();
  })
});

operatorBtn.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
    btnAudio.volume=".1";
    btnAudio.play();
  })
});

equalsBtn.addEventListener('click', button => {
  btnAudio.volume=".1";
  btnAudio.play();
  calculator.compute();
  calculator.updateDisplay();
});

deleteBtn.addEventListener('click', button => {
  btnAudio.volume=".1";
    btnAudio.play();
  calculator.delete();
  calculator.updateDisplay();
});

resetBtn.addEventListener('click', button => {
  btnAudio.volume=".1";
  btnAudio.play();
  calculator.clear();
  calculator.updateDisplay();
});
document.addEventListener('keydown' , function(e){
  if((isFinite(e.key))) calculator.appendNumber(e.key);
  else if('+-/*'.includes(e.key)) calculator.chooseOperation(e.key);
  else if(e.key === '=' || (e.key === 'Enter')) calculator.compute();
  else if(e.key === 'Delete') calculator.clear();
  else if(e.key === 'Backspace') calculator.delete();
  calculator.updateDisplay();
});



