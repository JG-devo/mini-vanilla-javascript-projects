'use strict';

const balance = document.querySelector('.balance-heading');
const income = document.querySelector('.balance__income');
const expense = document.querySelector('.balance__expense');
const historyList = document.querySelector('.history__list');
const form = document.querySelector('.form');

const text = document.getElementById('text');
const amount = document.getElementById('amount');

// const dummyTransactions = [
//   { id: 1, text: 'Flowers', amount: -20 },
//   { id: 2, text: 'Salary', amount: 300 },
//   { id: 3, text: 'Book', amount: -10 },
//   { id: 4, text: 'Camera', amount: 150 },
// ];

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions =
  localStorageTransactions !== null ? localStorageTransactions : [];

const addTransactionDOM = transaction => {
  const sign = transaction.amount < 0 ? '-' : '+';

  const markup = `
    <li class="${sign === '-' ? 'minus' : 'plus'}">
      ${transaction.text} <span>$${
    (sign, Math.abs(transaction.amount).toFixed(2))
  }</span>
      <button class="history__list--delete" onclick="removeTransaction(${
        transaction.id
      })">X</button>
    </li>`;

  historyList.insertAdjacentHTML('beforeend', markup);
};

const updateValues = () => {
  const amounts = transactions.map(item => item.amount);

  const overallTotal = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);

  const incomeTotal = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => acc + item, 0)
    .toFixed(2);

  const expenseTotal = (
    amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1
  ).toFixed(2);

  balance.innerText = `$${overallTotal}`;
  income.innerText = `+ $${incomeTotal}`;
  expense.innerText = `- $${expenseTotal}`;
};

const addTransaction = e => {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '')
    return alert('Please add text and an amount');

  const transaction = {
    id: Math.floor(Math.random() * 100000000),
    text: text.value,
    amount: Number(amount.value),
  };

  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();
  text.value = '';
  amount.value = '';
};

const removeTransaction = id => {
  transactions = transactions.filter(item => item.id !== id);
  updateLocalStorage();
  init();
};

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions));
};

const init = () => {
  historyList.innerHTML = '';
  transactions.forEach(item => addTransactionDOM(item));
  updateValues();
};

init();

form.addEventListener('submit', addTransaction);
