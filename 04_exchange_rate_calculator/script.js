class Model {
  timeout(s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} seconds`));
      }, s * 1000);
    });
  }

  getJSON = async function () {
    try {
      const api = fetch('https://open.exchangerate-api.com/v6/latest');
      const res = await Promise.race([api, this.timeout(5)]);
      const data = await res.json();
      const { rates } = data;
      return rates;
    } catch (err) {
      throw err;
    }
  };
}

class View {
  swapBtn = document.getElementById('swap');
  currencyEl1 = document.getElementById('currency-one');
  amountEl1 = document.getElementById('amount-one');
  currencyEl2 = document.getElementById('currency-two');
  amountEl2 = document.getElementById('amount-two');
  rateEl = document.querySelector('.rate');

  calculate(data) {
    const currencyOne = this.currencyEl1.value;
    const currencyTwo = this.currencyEl2.value;

    const rate = data[currencyTwo] / data[currencyOne];
    this.rateEl.innerText = `1 ${currencyOne} = ${rate.toFixed(
      2
    )} ${currencyTwo}`;
    this.amountEl2.value = (this.amountEl1.value * rate).toFixed(2);
  }

  renderSelection(data) {
    Object.keys(data).map(data => {
      this.currencyEl1.insertAdjacentHTML(
        'afterbegin',
        `<option value="${data}">${data}</option>`
      );
      this.currencyEl2.insertAdjacentHTML(
        'afterbegin',
        `<option value="${data}">${data}</option>`
      );
    });
  }

  swap(data) {
    [this.currencyEl1.value, this.currencyEl2.value] = [
      this.currencyEl2.value,
      this.currencyEl1.value,
    ];

    // const temp = this.currencyEl1.value;
    // this.currencyEl1.value = this.currencyEl2.value;
    // this.currencyEl2.value = temp;
    this.calculate(data);
  }

  bindSwapBtn(handler) {
    this.swapBtn.addEventListener('click', handler);
  }

  bindCurrencyBtn(handler) {
    [this.currencyEl1, this.currencyEl2].forEach(target =>
      target.addEventListener('change', handler)
    );
  }

  bindAmountInput(handler) {
    [this.amountEl1, this.amountEl2].forEach(target =>
      target.addEventListener('input', handler)
    );
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.loadRenderSelection();
    this.view.bindCurrencyBtn(this.controlCalculate.bind(this));
    this.view.bindAmountInput(this.controlCalculate.bind(this));
    this.view.bindSwapBtn(this.handleSwapBtn.bind(this));
  }

  controlCalculate = async function () {
    try {
      const data = await this.model.getJSON();
      this.view.calculate(data);
    } catch (err) {
      console.error(err);
    }
  };

  loadRenderSelection = async function () {
    try {
      const data = await this.model.getJSON();
      this.view.renderSelection(data);
    } catch (err) {
      console.error(err);
    }
  };

  handleSwapBtn = async function () {
    try {
      const data = await this.model.getJSON();
      this.view.swap(data);
    } catch (err) {
      console.error(err);
    }
  };
}

const app = new Controller(new Model(), new View());
