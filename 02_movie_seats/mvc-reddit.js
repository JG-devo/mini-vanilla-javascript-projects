<div class="screen__container hidden">
  <div class="screen">
    <h2>Nu Cinema Presents</h2>
  </div>

  <seat-row></seat-row>
  <seat-row occupied="4,5"></seat-row>
  <seat-row occupied="7,8"></seat-row>
  <seat-row></seat-row>
  <seat-row occupied="4,5"></seat-row>
  <seat-row occupied="5,6"></seat-row>
</div>;

('use strict');

class SeatRow extends HTMLElement {
  constructor() {
    super();
    this.classList.add('seat__row');
    const seatsOccupied = this.hasAttribute('occupied')
      ? this.getAttribute('occupied').split(',').map(Number)
      : null;
    for (let i = 1; i <= 8; i++) {
      const seatPosition = document.createElement('div');
      seatPosition.classList.add('seat__position');
      if (seatsOccupied && seatsOccupied.includes(i))
        seatPosition.classList.add('seat__occupied');
      this.append(seatPosition);
    }
  }
}

customElements.define('seat-row', SeatRow);

class View {
  constructor() {
    //~ Moved these to the constructor
    this.screenContainer = document.querySelector('.screen__container');
    this.showcaseLegend = document.querySelector('.showcase__legend');
    this.checkoutText = document.querySelector('.checkout__text');
    this.unoccupiedSeats = document.querySelectorAll(
      '.seat__row .seat__position:not(.seat__occupied)'
    );
    this.count = document.querySelector('#checkout__text--count');
    this.total = document.querySelector('#checkout__text--total');
    this.movieSelect = document.querySelector('#movie');
    this.ticketPrice = +this.movieSelect.value;
    //~ "index" was a very confusing name for an array.
    this.selectedSeatsArray = [];
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
      let { selectedIndex } = e.target; //~ ==> let selectedIndex = e.target.selectedIndex;
      selectedIndex = Number.parseInt(selectedIndex);

      if (selectedIndex === 0) this.addHiddenClass();
      if (selectedIndex > 0) this.removeHiddenClass();

      this.ticketPrice = +e.target.value;
      handler(selectedIndex, e.target.value);
      this.updateSelectedSeats();
    });
  }

  updateSelectedSeats() {
    const selectedSeats = document.querySelectorAll(
      '.seat__row .seat__selected'
    );

    this.selectedSeatsArray = [...selectedSeats].map(seat => {
      //~ indexOf is kind of an old method. includes is what we use nowadays
      //~ as it's more readable.
      return [...this.unoccupiedSeats].includes(seat);
    });

    localStorage.setItem(
      'selectedSeats',
      JSON.stringify(this.selectedSeatsArray)
    );

    const numSeats = selectedSeats.length;
    this.count.innerText = numSeats;
    this.total.innerText = numSeats * this.ticketPrice;
  }

  populateUI() {
    const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));

    if (selectedSeats !== null && selectedSeats.length > 1)
      this.unoccupiedSeats.forEach((seat, index) => {
        if (selectedSeats.includes(index)) seat.classList.add('seat__selected');
      });

    this.selectSavedMovie();
    this.ticketPrice = localStorage.getItem('selectedMoviePrice');
  }

  selectSavedMovie() {
    //~ Careful with the + sign as it will coerce null to 0,
    //~ which is probably not what you want.
    const selectedMovieIndex = Number.parseInt(
      localStorage.getItem('selectedMovieIndex')
    );

    //~ If no index is found in local storage, the function can stop here.
    //~ It avoids wrapping everything in an if statement.
    if (!selectedMovieIndex) return;

    this.movieSelect.selectedIndex = selectedMovieIndex;

    if (selectedMovieIndex === 0) this.addHiddenClass();
    else this.removeHiddenClass();
  }
}
