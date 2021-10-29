class Model {
  state = {
    correctLetters: [],
    wrongLetters: [],
    gameActive: true,
  };

  async wordGenerator() {
    const response = await fetch(
      'https://random-word-api.herokuapp.com/word?number=1'
    );
    const data = await response.json();
    this.state.word = data[0];
  }

  clearState() {
    this.state.correctLetters = [];
    this.state.wrongLetters = [];
    this.state.word = '';
    this.state.gameActive = true;
  }
}

class View {
  playAgainBtn = document.getElementById('play-btn');
  wordEl = document.getElementById('word');
  wrongLettersEl = document.getElementById('wrong-letters');
  popup = document.getElementById('popup-container');
  notification = document.getElementById('notification-container');
  finalMessage = document.getElementById('final-message');
  revealWord = document.querySelector('.reveal-word');
  figureParts = document.querySelectorAll('.figure-part');

  displayWord(data) {
    this.wordEl.innerHTML = `
    ${data.word
      .split('')
      .map(
        letter =>
          `<div class="letter">
        ${data.correctLetters.includes(letter) ? letter : ''}
    </div>`
      )
      .join('')}`;

    const innerWord = this.wordEl.innerText.replace(/\n/g, '');
    if (innerWord === data.word) {
      this.finalMessage.innerText = 'Well done! 🥳';
      this.revealWord.innerText = `The word is ${data.word}.`;
      this.popup.style.display = 'flex';
      data.gameActive = false;
    }
  }

  updateWrongLettersEl(data) {
    this.wrongLettersEl.innerHTML = `
    ${data.wrongLetters.length > 0 ? '<p>Wrong</p>' : ''}
    <span>${data.wrongLetters.slice().join(', ')}</span>
    `;

    this.figureParts.forEach((part, index) => {
      const errors = data.wrongLetters.length;
      if (index < errors) {
        part.style.display = 'block';
      } else {
        part.style.display = 'none';
      }
    });

    if (data.wrongLetters.length === this.figureParts.length) {
      this.finalMessage.innerText = 'Nope, Try Again! 😩';
      this.revealWord.innerText = `The word is ${data.word}.`;
      this.popup.style.display = 'flex';
      data.gameActive = false;
    }
  }

  showNotification() {
    this.notification.classList.add('show');

    setTimeout(() => {
      this.notification.classList.remove('show');
    }, 2000);
  }

  clearView() {
    this.wrongLettersEl.innerHTML = '';
    this.figureParts.forEach(part => (part.style.display = 'none'));
    this.popup.style.display = 'none';
  }

  bindPlayAgain(handler) {
    this.playAgainBtn.addEventListener('click', handler);
  }

  bindDataCapture(handler) {
    window.addEventListener('keypress', event => {
      const regex = /^[a-zA-Z]*$/;
      if (!regex.test(event.key)) return;
      handler(event.key);
    });
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.init();

    this.view.bindPlayAgain(this.handlePlayAgain);
    this.view.bindDataCapture(this.dataCaptureAndDisplay);
  }

  async init() {
    await this.model.wordGenerator();
    this.view.displayWord(this.model.state);
  }

  handlePlayAgain = () => {
    this.model.clearState();
    this.view.clearView();
    this.init();
  };

  dataCaptureAndDisplay = (letter, data = this.model.state) => {
    if (!data.gameActive) return;

    if (data.word.includes(letter)) {
      if (!data.correctLetters.includes(letter)) {
        data.correctLetters.push(letter);

        this.view.displayWord(data);
      } else {
        this.view.showNotification();
      }
    } else {
      if (!data.wrongLetters.includes(letter)) {
        data.wrongLetters.push(letter);

        this.view.updateWrongLettersEl(data);
      } else {
        this.view.showNotification();
      }
    }
  };
}

const app = new Controller(new Model(), new View());
