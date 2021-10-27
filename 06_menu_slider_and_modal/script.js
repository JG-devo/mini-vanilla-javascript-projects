const toggleEl = document.getElementById('toggle');
const openEl = document.getElementById('open');
const closeEl = document.getElementById('close');
const modalEl = document.getElementById('modal');

toggleEl.addEventListener('click', () =>
  document.body.classList.toggle('show-nav')
);

openEl.addEventListener('click', () => modalEl.classList.add('show-modal'));
closeEl.addEventListener('click', () => modalEl.classList.remove('show-modal'));
window.addEventListener('click', e =>
  e.target.classList.contains('modal-container')
    ? modalEl.classList.remove('show-modal')
    : false
);
