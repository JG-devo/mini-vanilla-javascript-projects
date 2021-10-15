'use strict';

class Model {
  setMovieData(selectedSeats, movieIndex = false, moviePrice = false) {
    localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));

    if (!movieIndex) return;
    localStorage.setItem('selectedMovieIndex', movieIndex);
    if (!moviePrice) return;
    localStorage.setItem('selectedMoviePrice', moviePrice);
  }

  getMovieData() {
    const seats = JSON.parse(localStorage.getItem('selectedSeats'));
    const index = localStorage.getItem('selectedMovieIndex');
    const price = localStorage.getItem('selectedMoviePrice');

    return {
      seats: seats,
      index: +index,
      price: +price,
    };
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
  }

  seatHandler(handler) {
    this.screenContainer.addEventListener('click', e => {
      const seat = e.target.classList.contains('seat__position');
      const occupied = e.target.classList.contains('seat__occupied');

      if (seat && !occupied) e.target.classList.toggle('seat__selected');
      this.updateSelectedSeats();
      handler(this.updateSelectedSeats());
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
      if (e.target.selectedIndex === 0) this.addHiddenClass();
      if (e.target.selectedIndex > 0) this.removeHiddenClass();

      this.ticketPrice = +e.target.value;
      this.updateSelectedSeats();

      handler(
        this.updateSelectedSeats(),
        e.target.selectedIndex,
        e.target.value
      );
    });
  }

  updateSelectedSeats() {
    const selectedSeats = document.querySelectorAll(
      '.seat__row .seat__selected'
    );

    this.index = [...selectedSeats].map(seat =>
      [...this.unoccupiedSeats].indexOf(seat)
    );

    const numSeats = selectedSeats.length;
    this.count.innerText = numSeats;
    this.total.innerText = numSeats * this.ticketPrice;

    return this.index;
  }

  populateUI(data) {
    if (data.seats !== null && data.seats.length > 1)
      this.unoccupiedSeats.forEach((seat, index) => {
        if (data.seats.indexOf(index) > -1)
          seat.classList.add('seat__selected');
      });

    if (data.index) {
      this.movieSelect.selectedIndex = data.index;
    }

    if (data.index === 0) this.addHiddenClass();
    else this.removeHiddenClass();

    this.ticketPrice = data.price;
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindSetMovieData(this.handleSetMovieData);

    this.handleMovieData();
    this.view.seatHandler(this.handleSetMovieData);
    this.view.updateSelectedSeats();
  }

  handleSetMovieData = (selectedSeats, movieIndex, moviePrice) => {
    this.model.setMovieData(selectedSeats, movieIndex, moviePrice);
  };

  handleMovieData() {
    this.view.populateUI(this.model.getMovieData());
  }
}

const app = new Controller(new Model(), new View());
