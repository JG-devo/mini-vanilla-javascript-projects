'use strict';

// To be completed - add error handling and render spinner waiting for API

class Model {
  state = [];

  getRandomUser = async function () {
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

    this.state.push(newUser);
  };

  doubleMoney() {
    this.state = this.state.map(arr => {
      return { ...arr, money: arr.money * 2 };
    });
    return this.state;
  }

  sortRichest() {
    this.state = this.state.sort((a, b) => b.money - a.money);
    return this.state;
  }

  filterMillionaires() {
    this.state = this.state.filter(person => person.money >= 1000000);
    return this.state;
  }

  calculateWealth() {
    const wealth = this.state.reduce((acc, person) => (acc += person.money), 0);
    return wealth;
  }
}

class View {
  addUserBtn = document.getElementById('add-user');
  doubleBtn = document.getElementById('double');
  sortBtn = document.getElementById('sort');
  showMillionairesBtn = document.getElementById('show-millionaires');
  calculateWealthBtn = document.getElementById('calculate-wealth');
  mainEl = document.getElementById('main');

  renderDOM(data, clear = true) {
    if (clear) this.clear();

    if (document.querySelector('.total'))
      document.querySelector('.total').remove();

    data.forEach(person => {
      this.mainEl.insertAdjacentHTML('beforeend', this.personMarkup(person));
    });
  }

  updateDOM(data) {
    const newMarkup = data.map(person => this.personMarkup(person)).join('');

    // Creating a virtual dom element to compare changes
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('.money'));
    const curElements = Array.from(this.mainEl.querySelectorAll('.money'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));
      // console.log(newEl.firstChild);

      // Updates change money value only
      if (!newEl.isEqualNode(curEl)) {
        curEl.textContent = newEl.textContent;
      }
    });
  }

  clear() {
    this.mainEl.innerHTML = '<h2><strong>Person</strong> Wealth</h2>';
  }

  personMarkup(person) {
    return `
      <div class="person">
        <img
          src="${person.photo}"
          alt="${person.name}"
        />
        <p><strong>${person.name}</strong></p>
        <p class="money">${this._formatMoney(person.money)}</p>
      </div>`;
  }

  renderWealth(totalWealth) {
    if (this.mainEl.querySelector('.total')) return;

    this.mainEl.insertAdjacentHTML(
      'beforeend',
      `
        <div class="total">
          <h3>Total</h3>
          <p>${this._formatMoney(totalWealth)}</p>
        </div>
    `
    );
  }

  _formatMoney(number) {
    return '$' + number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  bindAddUser(handler) {
    this.addUserBtn.addEventListener('click', handler);
  }

  bindDoubleBtn(handler) {
    this.doubleBtn.addEventListener('click', handler);
  }

  bindSortBtn(handler) {
    this.sortBtn.addEventListener('click', handler);
  }

  bindFilterMillionaires(handler) {
    this.showMillionairesBtn.addEventListener('click', handler);
  }

  bindWealthCalculator(handler) {
    this.calculateWealthBtn.addEventListener('click', handler);
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this._preloadUsers(3);
    this.view.bindAddUser(this.addUser.bind(this));
    this.view.bindDoubleBtn(this.handleDoubleBtn.bind(this));
    this.view.bindSortBtn(this.handleSortBtn.bind(this));
    this.view.bindFilterMillionaires(this.handleFilterMillionaires.bind(this));
    this.view.bindWealthCalculator(this.handleWealthCalculator.bind(this));
  }

  async _preloadUsers(number) {
    for (let i = 1; i <= number; i++) {
      await this.model.getRandomUser();
    }
    this.view.renderDOM(this.model.state);
  }

  async addUser() {
    await this.model.getRandomUser();
    const newUser = [this.model.state.at(-1)];
    this.view.renderDOM(newUser, false);
  }

  handleDoubleBtn() {
    this.view.updateDOM(this.model.doubleMoney());
  }

  handleSortBtn() {
    this.view.renderDOM(this.model.sortRichest());
  }

  handleFilterMillionaires() {
    this.view.renderDOM(this.model.filterMillionaires());
  }

  handleWealthCalculator() {
    this.view.renderWealth(this.model.calculateWealth());
  }
}

const app = new Controller(new Model(), new View());
