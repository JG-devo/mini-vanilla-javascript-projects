'use strict';

class Model {
  setMovieData(movieIndex, moviePrice) {
    localStorage.setItem('selectedMovieIndex', movieIndex);
    localStorage.setItem('selectedMoviePrice', moviePrice);
  }

  selectedSeats(index) {
    localStorage.setItem('selectedSeats', JSON.stringify(index));
  }
}

class View {
  screenContainer = document.querySelector('.screen__container');
  showcaseLegend = document.querySelector('.showcase__legend');
  checkoutText = document.querySelector('.checkout__text');
  unoccupiedSeats = document.querySelectorAll(
    '.seat__row .seat__position:not(.seat__occupied)'
  );
  count = document.querySelector('#checkout__text--count');
  total = document.querySelector('#checkout__text--total');

  constructor() {
    this.movieSelect = document.querySelector('#movie');
    this.ticketPrice = +this.movieSelect.value;
    this.index = [];
    this.populateUI();
    this._seatHandler();
    this.updateSelectedSeats();
  }

  _seatHandler() {
    this.screenContainer.addEventListener('click', e => {
      const seat = e.target.classList.contains('seat__position');
      const occupied = e.target.classList.contains('seat__occupied');

      if (seat && !occupied) e.target.classList.toggle('seat__selected');
      this.updateSelectedSeats();
    });
  }

  addHiddenClass() {
    [this.screenContainer, this.showcaseLegend, this.checkoutText].forEach(
      each => each.classList.add('hidden')
    );
  }

  removeHiddenClass() {
    [this.screenContainer, this.showcaseLegend, this.checkoutText].forEach(
      each => each.classList.remove('hidden')
    );
  }

  bindSetMovieData(handler) {
    this.movieSelect.addEventListener('change', e => {
      console.log(e.target.children);
      if (e.target.selectedIndex === 0) this.addHiddenClass();
      if (e.target.selectedIndex > 0) this.removeHiddenClass();

      this.ticketPrice = +e.target.value;
      handler(e.target.selectedIndex, e.target.value);
      this.updateSelectedSeats();
    });
  }

  updateSelectedSeats() {
    const selectedSeats = document.querySelectorAll(
      '.seat__row .seat__selected'
    );

    this.index = [...selectedSeats].map(seat =>
      [...this.unoccupiedSeats].indexOf(seat)
    );

    localStorage.setItem('selectedSeats', JSON.stringify(this.index));

    const numSeats = selectedSeats.length;
    this.count.innerText = numSeats;
    this.total.innerText = numSeats * this.ticketPrice;
  }

  // uploadSelectedSeats(upload) {
  //   upload(this.index);
  // }

  populateUI() {
    const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));

    if (selectedSeats !== null && selectedSeats.length > 1)
      this.unoccupiedSeats.forEach((seat, index) => {
        if (selectedSeats.indexOf(index) > -1)
          seat.classList.add('seat__selected');
      });

    const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');

    if (selectedMovieIndex) {
      this.movieSelect.selectedIndex = selectedMovieIndex;
    }

    if (+selectedMovieIndex === 0) this.addHiddenClass();
    else this.removeHiddenClass();

    this.ticketPrice = localStorage.getItem('selectedMoviePrice');
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindSetMovieData(this.handleSetMovieData);
    // this.view.uploadSelectedSeats(this.handleUploadSelectedSeats);
  }

  handleSetMovieData = (index, value) => {
    this.model.setMovieData(index, value);
  };

  // handleUploadSelectedSeats = index => {
  //   this.model.selectedSeats(index);
  // };
}

const app = new Controller(new Model(), new View());
