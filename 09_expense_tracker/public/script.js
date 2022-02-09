'use strict';

const balance = document.querySelector('.balance-heading');
const welcomeText = document.querySelector('.welcome-box__tag');
const income = document.querySelector('.balance__income');
const expense = document.querySelector('.balance__expense');
const historyList = document.querySelector('.history__list');
const form = document.querySelector('.form');

const text = document.querySelector('#text');
const amount = document.querySelector('#amount');

const loginContainer = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const loginName = document.querySelector('#name');
const loginPassword = document.querySelector('#password');
const overlay = document.querySelector('.overlay');

const updateCancel = document.querySelector('.update-form__btn--cancel');
const updateContainer = document.querySelector('.update');
const updateForm = document.querySelector('.update-form');
const updatedAmount = document.querySelector('#update-amount');
const updatedText = document.querySelector('#update-text');

const logOutBtn = document.querySelector('.welcome-box__btn');

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

    welcomeDOM(data.owner);

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

const welcomeDOM = owner => {
  welcomeText.innerText = `Account: ${owner}`;
};

const logout = e => {
  e.preventDefault();
  localStorage.removeItem('token');
  transactions = {};
  historyList.innerHTML = '';
  balance.innerText = '$0.00';
  income.innerText = '$0.00';
  expense.innerText = '$0.00';
  welcomeText.innerText = 'Logged Out';
  loginContainer.classList.remove('hidden');
  overlay.classList.remove('hidden');
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
      <button class="history__list--update" onclick="updateTransaction('${
        transaction._id
      }')">U</button>
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

  try {
    const token = localStorage.getItem('token');
    const { data } = await axios.post(
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
    transactions.push(data.expense);
    addTransactionDOM(data.expense);
  } catch (error) {
    console.log(error);
  }

  updateValues();

  text.value = '';
  amount.value = '';
};

const removeTransaction = async id => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`/api/v1/expenses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    init();
  } catch (error) {
    console.log(error);
  }
};

const updateTransaction = id => {
  updateContainer.classList.remove('hidden');
  overlay.classList.remove('hidden');

  const closeUpdateModal = e => {
    e.preventDefault();
    updateContainer.classList.add('hidden');
    overlay.classList.add('hidden');
  };

  updateCancel.addEventListener('click', closeUpdateModal);
  overlay.addEventListener('click', closeUpdateModal);

  const [currentTransaction] = transactions.filter(item => item._id === id);
  updatedAmount.value = currentTransaction.amount;
  updatedText.value = currentTransaction.text;

  updateForm.addEventListener('submit', async e => {
    try {
      e.preventDefault();

      const token = localStorage.getItem('token');

      if (updatedText.value.trim() === '' || updatedAmount.value.trim() === '')
        return alert('Please add text and an amount');

      await axios.patch(
        `/api/v1/expenses/${id}`,
        {
          text: updatedText.value,
          amount: Number(updatedAmount.value),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      closeUpdateModal(e);
      loadDatabase(token);
    } catch (error) {
      console.log(error);
    }
  });
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
logOutBtn.addEventListener('click', logout);
