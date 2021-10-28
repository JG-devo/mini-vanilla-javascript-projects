const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-btn');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');

const figureParts = document.querySelectorAll('.figure-part');

const wordGenerator = async function () {
  const response = await fetch(
    'https://random-word-api.herokuapp.com/word?number=1'
  );
  const data = await response.json();
  state.word = data[0];
};

const state = {
  correctLetters: [],
  wrongLetters: [],
};

const init = async function () {
  await wordGenerator();
  displayWord();
  console.log(state);
};

const displayWord = function () {
  wordEl.innerHTML = `
  ${state.word
    .split('')
    .map(
      letter =>
        `<div class="letter">
      ${state.correctLetters.includes(letter) ? letter : ''}
  </div>`
    )
    .join('')}`;

  const innerWord = wordEl.innerText.replace(/\n/g, '');
  if (innerWord === state.word) {
    finalMessage.innerText = 'You Won!';
    popup.style.display = 'flex';
  }
};

const updateWrongLettersEl = function () {
  wrongLettersEl.innerHTML = `
  ${state.wrongLetters.length > 0 ? '<p>Wrong</p>' : ''}
  <span>${state.wrongLetters.slice().join(', ')}</span>
  `;

  figureParts.forEach((part, index) => {
    const errors = state.wrongLetters.length;
    if (index < errors) {
      part.style.display = 'block';
    } else {
      part.style.display = 'block';
    }
  });

  if (state.wrongLetters.length === figureParts.length) {
    finalMessage.innerText = 'You Lost!';
    popup.style.display = 'flex';
  }
};

const showNotification = function () {
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
};

// Event listeners
window.addEventListener('keydown', e => {
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    const letter = e.key;

    if (state.word.includes(letter)) {
      if (!state.correctLetters.includes(letter)) {
        state.correctLetters.push(letter);

        displayWord();
      } else {
        showNotification();
      }
    } else {
      if (!state.wrongLetters.includes(letter)) {
        state.wrongLetters.push(letter);

        updateWrongLettersEl();
      } else {
        showNotification();
      }
    }
  }
});

playAgainBtn.addEventListener('click', () => {
  state.correctLetters = [];
  state.wrongLetters = [];
  state.word = '';

  wrongLettersEl.innerHTML = '';
  figureParts.forEach(part => (part.style.display = 'none'));
  popup.style.display = 'none';
  init();
});

init();
