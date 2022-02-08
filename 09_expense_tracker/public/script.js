'use strict';

const balance = document.querySelector('.balance-heading');
const income = document.querySelector('.balance__income');
const expense = document.querySelector('.balance__expense');
const historyList = document.querySelector('.history__list');
const form = document.querySelector('.form');

const text = document.querySelector('#text');
const amount = document.querySelector('#amount');

const loginContainer = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const overlay = document.querySelector('.overlay');
const loginName = document.querySelector('#name');
const loginPassword = document.querySelector('#password');

let transactions = {};

const loadDatabase = async token => {
  try {
    const { data } = await axios.get('api/v1/expenses', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!data.expenses) transactions = [];
    transactions = data.expenses;

    historyList.innerHTML = '';
    transactions.forEach(item => addTransactionDOM(item));
    updateValues();
  } catch (error) {
    console.log(error);
    throw new Error('Login is required');
  }
};

const checkLoggedIn = async () => {
  const token = localStorage.getItem('token');
  try {
    await loadDatabase(token);
    loginContainer.classList.add('hidden');
    overlay.classList.add('hidden');
  } catch (error) {
    localStorage.removeItem('token');
  }
};

const login = async e => {
  e.preventDefault();

  const name = loginName.value;
  const password = loginPassword.value;

  try {
    const { data } = await axios.post('/api/v1/auth/login', {
      name,
      password,
    });

    loginName.value = '';
    loginPassword.value = '';

    localStorage.setItem('token', data.token);
    await loadDatabase(data.token);

    loginContainer.classList.add('hidden');
    overlay.classList.add('hidden');
  } catch (error) {
    localStorage.removeItem('token');
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
    const token = localStorage.getItem('token');
    await axios.post(
      '/api/v1/expenses',
      {
        text: transaction.text,
        amount: transaction.amount,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
  try {
    await checkLoggedIn();
  } catch (error) {
    console.log(error);
  }
};

init();

form.addEventListener('submit', addTransaction);
loginForm.addEventListener('submit', login);
