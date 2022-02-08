'use strict';

const balance = document.querySelector('.balance-heading');
const income = document.querySelector('.balance__income');
const expense = document.querySelector('.balance__expense');
const historyList = document.querySelector('.history__list');
const form = document.querySelector('.form');

const text = document.getElementById('text');
const amount = document.getElementById('amount');

let transactions = {};

const database = async () => {
  try {
    const { data } = await axios.get('/api/v1/expenses');

    if (!data.expenses) transactions = [];
    transactions = data.expenses;
  } catch (error) {
    console.log(error);
  }
};

const addTransactionDOM = transaction => {
  const sign = transaction.amount < 0 ? '-' : '+';

  const markup = `
    <li class="${sign === '-' ? 'minus' : 'plus'}">
      ${transaction.text} <span>$${
    (sign, Math.abs(transaction.amount).toFixed(2))
  }</span>
      <button class="history__list--delete" onclick="removeTransaction('${
        transaction._id
      }')">X</button>
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

const addTransaction = async e => {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '')
    return alert('Please add text and an amount');

  const transaction = {
    text: text.value,
    amount: Number(amount.value),
  };

  console.log(transaction);

  addTransactionDOM(transaction);
  updateValues();
  try {
    await axios.post('/api/v1/expenses', {
      text: transaction.text,
      amount: transaction.amount,
    });
  } catch (error) {
    console.log(error);
  }

  text.value = '';
  amount.value = '';
};

const removeTransaction = async id => {
  try {
    await axios.delete(`/api/v1/expenses/${id}`);
    init();
  } catch (error) {
    console.log(error);
  }
};

const init = async () => {
  await database();
  console.log(transactions);
  historyList.innerHTML = '';
  transactions.forEach(item => addTransactionDOM(item));
  updateValues();
};

init();

form.addEventListener('submit', addTransaction);
