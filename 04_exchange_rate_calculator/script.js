const currencyEl1 = document.getElementById('currency-one');
const amountEl1 = document.getElementById('amount-one');
const currencyEl2 = document.getElementById('currency-two');
const amountEl2 = document.getElementById('amount-two');
const rateEl = document.querySelector('.rate');
const swapBtn = document.getElementById('swap');

const getJSON = async function () {
  try {
    const api = await fetch('https://open.exchangerate-api.com/v6/latest');
    return await api.json();
  } catch (err) {
    console.log(err);
  }
};

const renderSelection = async function () {
  const data = await getJSON();

  Object.keys(data.rates).map(data => {
    currencyEl1.insertAdjacentHTML(
      'afterbegin',
      `<option value="${data}">${data}</option>`
    );
    currencyEl2.insertAdjacentHTML(
      'afterbegin',
      `<option value="${data}">${data}</option>`
    );
  });
};

const calculate = async function () {
  const data = await getJSON();
  const currencyOne = currencyEl1.value;
  const currencyTwo = currencyEl2.value;

  const rate = data.rates[currencyOne] / data.rates[currencyTwo];
  rateEl.innerText = `1 ${currencyOne} = ${rate.toFixed(2)} ${currencyTwo}`;
  amountEl2.value = (amountEl1.value * rate).toFixed(2);
};

const swap = function () {
  const temp = currencyEl1.value;
  currencyEl1.value = currencyEl2.value;
  currencyEl2.value = temp;
  calculate();
};

renderSelection();

currencyEl1.addEventListener('change', calculate);
currencyEl2.addEventListener('change', calculate);
amountEl1.addEventListener('input', calculate);
amountEl2.addEventListener('input', calculate);
swapBtn.addEventListener('click', swap);
