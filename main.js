//  Html selectors
let btnKeys = document.querySelectorAll('.button');
let previousDisplay = document.querySelector('.result');
let currentDisplay = document.querySelector('.current-calc');

//Variables
let currentNumber = '';
let previousNumber = '';
let operation;
let hasDot = false;
let hasSign = false;

//Functions

const calculation = (value, type) => {
	switch (true) {
		case type.includes('operation'):
			checkSign(value);
			break;
		case type.includes('number'):
			checkNumber(value);
			break;
		case type.includes('dot'):
			checkDot(value);
			break;
		case type.includes('clear'):
			clearCalculator(value);
			break;
		case type.includes('equal'):
			calculateResult();
			break;
	}
};

const calculateResult = () => {
	if (currentNumber === '' || previousNumber === '') return;
	let expressionToCalculate = previousNumber + currentNumber;
	let result;

	try {
		result = eval(expressionToCalculate);
	} catch (error) {
		result = 'ERR';
	}
	let first = removeZeros(previousNumber);
	let second = removeZeros(currentNumber);
	previousNumber = '';
	currentNumber = result.toString();
	hasDot = currentNumber.includes('.') ? true : false;
	hasSign = false;
	result = result.toLocaleString('en');
	currentDisplay.innerText = result;

	previousDisplay.innerText = first + operation + second + '=';
};
const clearCalculator = (value) => {
	if (value === 'C') {
		currentNumber = '';
		previousNumber = '';
		operation = '';
		hasDot = false;
		hasSign = false;
	} else {
		if (currentNumber === '') return;

		currentNumber = currentNumber.slice(0, -1);
	}
	currentDisplay.innerText = currentNumber;
	previousDisplay.innerText = previousNumber;
};

const checkSign = (value) => {
	let lastEntity = currentNumber.slice(-1);

	if (lastEntity === '.' || (currentNumber === '' && previousNumber === ''))
		return;

	if (!hasSign) {
		hasSign = true;
		hasDot = false;
		previousNumber = currentNumber + value;
		currentNumber = '';
	} else {
		lastEntity = previousNumber.slice(-1);

		if (previousNumber && currentNumber) return;

		if (
			(previousNumber && lastEntity === '+') ||
			lastEntity === '-' ||
			lastEntity === '/' ||
			lastEntity === '*'
		) {
			previousNumber = previousNumber.slice(0, -1);
			previousNumber += value;
		}
	}

	currentDisplay.innerText = currentNumber;
	previousDisplay.innerText = previousNumber;
};

const checkNumber = (value) => {
	if (currentNumber[0] === '0' && value !== '.' && !hasDot) {
		currentNumber = currentNumber.slice(0, -1);
	}

	currentNumber += value;
	currentDisplay.innerHTML = currentNumber;
	previousDisplay.innerText = previousNumber;
};
const checkDot = (value) => {
	if (hasDot) return;
	currentNumber += value;
	hasDot = true;

	currentDisplay.innerText = currentNumber;
};

//function removes unnecessary zeros
const removeZeros = ([...number]) => {
	let lastEntity = number.slice(-1);
	if (isNaN(lastEntity)) {
		operation = lastEntity;
		number = number.slice(0, -1);
	}
	while (
		number[number.length - 1] === '0' ||
		number[number.length - 1] === '.'
	) {
		number.pop();
	}
	return number.join('');
};

//Event Listeners

btnKeys.forEach((button) =>
	button.addEventListener('click', (e) => {
		calculation(e.target.innerText, e.target.className);
	}),
);

window.addEventListener('keydown', (e) => {
	if (
		e.key === '0' ||
		e.key === '1' ||
		e.key === '2' ||
		e.key === '3' ||
		e.key === '4' ||
		e.key === '5' ||
		e.key === '6' ||
		e.key === '7' ||
		e.key === '8' ||
		e.key === '9'
	) {
		calculation(e.key, 'number');
	} else if (e.key === '/' || e.key === '-' || e.key === '+' || e.key === '*') {
		calculation(e.key, 'operation');
	} else if (e.key === '.') {
		calculation(e.key, 'dot');
	} else if (e.key === 'Enter') {
		calculation(e.key, 'equal');
	} else if (e.key === 'Backspace') {
		calculation('←', 'clear');
	} else if (e.key === 'Delete') {
		calculation('C', 'clear');
	}
	return;
});