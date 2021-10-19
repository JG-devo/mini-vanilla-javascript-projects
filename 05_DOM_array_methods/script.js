'use strict';

const mainEl = document.getElementById('main');
const addUserBtn = document.getElementById('add-user');
const doubleBtn = document.getElementById('double');
const showMillionairesBtn = document.getElementById('show-millionaires');
const sortBtn = document.getElementById('sort');
const calculateWealthBtn = document.getElementById('calculate-wealth');

let data = [];

const getRandomUser = async function () {
  const res = await fetch(
    'https://randomuser.me/api/?inc=name,picture&?nat=gb,fr,us,au'
  );
  const data = await res.json();
  const user = data.results[0];

  const newUser = {
    photo: user.picture.medium,
    name: `${user.name.first} ${user.name.last}`,
    money: Math.floor(Math.random() * 1000000),
  };

  addData(newUser);
};

const addData = function (obj) {
  data.push(obj);
  updateDOM();
};

const updateDOM = function (providedData = data) {
  mainEl.innerHTML = '<h2><strong>Person</strong> Wealth</h2>';

  providedData.forEach(function (person) {
    mainEl.insertAdjacentHTML(
      'beforeend',
      `
        <div class="person">
          <img
            src="${person.photo}"
            alt="${person.name}"
          />
          <p><strong>${person.name}</strong></p>
          <p class="money">${formatMoney(person.money)}</p>
        </div>
    `
    );
  });
};

const doubleMoney = function () {
  data = data.map(arr => {
    return { ...arr, money: arr.money * 2 };
  });

  updateDOM();
};

const sortRichest = function (a, b) {
  data.sort((a, b) => b.money - a.money);

  updateDOM();
};

const filterMillionaires = function () {
  data = data.filter(person => person.money >= 1000000);
  updateDOM();
};

const calculateWealth = function () {
  const wealth = data.reduce((acc, person) => (acc += person.money), 0);
  if (mainEl.querySelector('.total')) return;

  mainEl.insertAdjacentHTML(
    'beforeend',
    `
      <div class="total">
        <h3>Total</h3>
        <p>${formatMoney(wealth)}</p>
      </div>
  `
  );
};

const formatMoney = function (number) {
  return '$' + number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

getRandomUser();
getRandomUser();
getRandomUser();

// Event listeners

addUserBtn.addEventListener('click', getRandomUser);
doubleBtn.addEventListener('click', doubleMoney);
sortBtn.addEventListener('click', sortRichest);
showMillionairesBtn.addEventListener('click', filterMillionaires);
calculateWealthBtn.addEventListener('click', calculateWealth);
