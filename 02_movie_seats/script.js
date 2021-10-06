'use strict';

const screenContainer = document.querySelector('.screen__container');
const unoccupiedSeats = document.querySelectorAll(
  '.seat__row .seat__position:not(.seat__occupied)'
);

const count = document.querySelector('#checkout__text--count');
const total = document.querySelector('#checkout__text--total');

const movieSelect = document.querySelector('#movie');

populateUI();
let ticketPrice = +movieSelect.value;

const setMovieData = function (movieIndex, moviePrice) {
  localStorage.setItem('selectedMovieIndex', movieIndex);
  localStorage.setItem('selectedMoviePrice', moviePrice);
};

const updateSelectedSeats = function () {
  const selectedSeats = document.querySelectorAll('.seat__row .seat__selected');

  const seatsIndex = [...selectedSeats].map(seat =>
    [...unoccupiedSeats].indexOf(seat)
  );

  localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));

  const numSeats = selectedSeats.length;
  count.innerText = numSeats;
  total.innerText = numSeats * ticketPrice;
};

function populateUI() {
  const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));

  if (selectedSeats !== null && selectedSeats.length > 1)
    unoccupiedSeats.forEach((seat, index) => {
      if (selectedSeats.indexOf(index) > -1)
        seat.classList.add('seat__selected');
    });

  const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');

  if (selectedMovieIndex !== null) {
    movieSelect.selectedIndex = selectedMovieIndex;
  }
}

screenContainer.addEventListener('click', e => {
  const seat = e.target.classList.contains('seat__position');
  const occupied = e.target.classList.contains('seat__occupied');

  if (seat && !occupied) e.target.classList.toggle('seat__selected');
  updateSelectedSeats();
});

movieSelect.addEventListener('change', e => {
  ticketPrice = +e.target.value;
  setMovieData(e.target.selectedIndex, e.target.value);
  updateSelectedSeats();
});

updateSelectedSeats();
