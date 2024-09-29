import React, { useState } from 'react';
import './Calculator.css';

const Calculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const buttons = ['C', '()', '%', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '+/-', '0', '.', '='];

  const isOperator = (char) => ['+', '-', '*', '/', '%'].includes(char);

  const handleClick = (value) => {
    if (value === 'C') {
      setInput('');
      setResult('');
    } else if (value === '=') {
      try {
        const evaluatedResult = calculateResult(input);
        setResult(evaluatedResult);
      } catch (error) {
        setInput('Error');
        setResult('');
      }
    } else if (value === '+/-') {
      setInput((prevInput) => (prevInput.startsWith('-') ? prevInput.slice(1) : `-${prevInput}`));
    } else if (value === "()") {
      handleParentheses();
    } else {
      setInput((prevInput) => prevInput + value);
    }
  };

  const handleParentheses = () => {
    const openParentheses = (input.match(/\(/g) || []).length;
    const closeParentheses = (input.match(/\)/g) || []).length;
    if (openParentheses === closeParentheses) {
      setInput((prevInput) => prevInput + '(');
    } else {
      setInput((prevInput) => prevInput + ')');
    }
  };

  const calculateResult = (expression) => {
    const tokens = tokenize(expression);
    const outputQueue = [];
    const operatorStack = [];

    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2 };
    const associativity = { '+': 'L', '-': 'L', '*': 'L', '/': 'L', '%': 'L' };

    for (let token of tokens) {
      if (!isNaN(token)) {
        outputQueue.push(token);
      } else if (isOperator(token)) {
        while (
          operatorStack.length &&
          isOperator(operatorStack[operatorStack.length - 1]) &&
          ((associativity[token] === 'L' && precedence[token] <= precedence[operatorStack[operatorStack.length - 1]]) ||
            (associativity[token] === 'R' && precedence[token] < precedence[operatorStack[operatorStack.length - 1]]))
        ) {
          outputQueue.push(operatorStack.pop());
        }
        operatorStack.push(token);
      } else if (token === '(') {
        operatorStack.push(token);
      } else if (token === ')') {
        while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
          outputQueue.push(operatorStack.pop());
        }
        operatorStack.pop();
      }
    }

    while (operatorStack.length) {
      outputQueue.push(operatorStack.pop());
    }

    const resultStack = [];
    for (let token of outputQueue) {
      if (!isNaN(token)) {
        resultStack.push(parseFloat(token));
      } else if (isOperator(token)) {
        const b = resultStack.pop();
        const a = resultStack.pop();
        switch (token) {
          case '+':
            resultStack.push(a + b);
            break;
          case '-':
            resultStack.push(a - b);
            break;
          case '*':
            resultStack.push(a * b);
            break;
          case '/':
            resultStack.push(a / b);
            break;
          case '%':
            resultStack.push(a % b);
            break;
          default:
            break;
        }
      }
    }

    return resultStack[0].toString();
  };

  const tokenize = (expression) => {
    const tokens = [];
    let numberBuffer = [];

    for (let char of expression) {
      if (!isNaN(char) || char === '.') {
        numberBuffer.push(char);
      } else {
        if (numberBuffer.length) {
          tokens.push(numberBuffer.join(''));
          numberBuffer = [];
        }
        if (isOperator(char) || char === '(' || char === ')') {
          tokens.push(char);
        }
      }
    }

    if (numberBuffer.length) {
      tokens.push(numberBuffer.join(''));
    }

    return tokens;
  };

  return (
    <div className='container'>
      <h1 className='title'>Calculator</h1>
      <div className="rectangle-container">
        <div className="rectangle1">
          <div className="input-display">{input || '0'}</div>
          {result && <div className="result-display">{result}</div>}
        </div>
        <div className='rectangle2'>
          {buttons.map((item, index) => (
            <div key={index} className="boxes" onClick={() => handleClick(item)}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
