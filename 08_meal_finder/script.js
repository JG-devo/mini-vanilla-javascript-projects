class Model {
  state = {
    recipe: {},
    search: {
      query: '',
      results: [],
    },
  };

  createRecipeObject(data) {
    const recipe = data.meals[0];
    return {
      id: +recipe.idMeal,
      title: recipe.strMeal,
      image: recipe.strMealThumb,
      mealOrigin: recipe.strArea,
      instructions: recipe.strInstructions,
      ...(recipe.strSource && { sourceURL: recipe.strSource }),
      youTube: recipe.strYoutube,
      ingredients: createIngredientsArray(recipe),
    };
  }

  async mealSearch(search) {
    try {
      const query = this._formatSearchQuery(search);
      if (!query) throw 'Please type your search query first, and try again!';

      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/${query}${search}`
      );
      const data = await res.json();
      return data;
    } catch (err) {
      throw err;
    }
  }

  _formatSearchQuery(search) {
    if (!search) return;
    if (String(search) === '?random') return 'random.php';
    if (Number(search)) return 'lookup.php?i=';
    if (String(search.length) <= 1) return 'search.php?f=';
    if (String(search.length > 2)) return 'search.php?s=';
  }

  createIngredientsArray(data) {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
      if (data[`strIngredient${i}`])
        ingredients.push(
          `${data[`strIngredient${i}`]}: ${data[`strMeasure${i}`]}`
        );
      // else break;
    }
    return ingredients;
  }

  async createSearchResultsObject(data) {
    try {
      app.model.state.search.results = await data.meals.map(recipe => {
        return {
          id: +recipe.idMeal,
          title: recipe.strMeal,
          image: recipe.strMealThumb,
          mealOrigin: recipe.strArea,
        };
      });
    } catch (err) {
      throw err;
    }
  }
}

class View {}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view - view;
  }
}

const app = new Controller(new Model(), new View());

const titleStyler = function (str) {
  return str.length > 25 ? str.substring(0, 25) + '...' : str;
};

const displaySearchResults = async function (searchTerm) {
  try {
    renderSpinner();
    const data = await app.model.mealSearch(searchTerm);
    if (!data?.meals) throw 'Oops! No results found. Please try again! 🍔';

    await app.model.createSearchResultsObject(data);
    const results = app.model.state.search.results;
    app.model.state.search.query = searchTerm;
    generateSearchResultsMarkup(results, searchTerm);
  } catch (err) {
    renderError(err);
  }
};

const displayRecipeResults = async function (searchID) {
  try {
    renderSpinner();
    const data = await app.model.mealSearch(searchID);
    const recipe = await app.model.createRecipeObject(data);
    app.model.state.recipe = recipe;
    generateRecipeMarkup(recipe);
  } catch (err) {
    console.log('DisplayRecipeResults:', err);
  }
};

const generateSearchResultsMarkup = function (results, searchTerm) {
  removeSpinner();
  singleMeal.innerHTML = '';
  resultsHeading.innerHTML = `<h2>Here are the results for ${searchTerm}...</h2>`;
  mealsEl.innerHTML = '';
  brandingEl.classList.replace('branding--load', 'branding--results');
  showError.classList.remove('show');
  searchInput.value = '';
  searchInput.blur();

  results.forEach(recipe => {
    mealsEl.insertAdjacentHTML(
      'afterbegin',
      `
            <div class="meals--search-results" data-id="${recipe.id}">
              <a href="#${recipe.id}">
                <img
                  id="${recipe.id}"
                  src="img/spinner.svg"
                  alt="${recipe.title}..."
                />
              </a>
              <h3><a href="#${recipe.id}">${titleStyler(recipe.title)}</a></h3>
              <sub>Cuisine: ${recipe.mealOrigin}</sub>
            </div>`
    );
    displayResolvedImage(recipe.image, recipe.id);
  });
};

const generateRecipeMarkup = function (recipe) {
  removeSpinner();
  singleMeal.innerHTML = '';
  const instructions = recipe.instructions.replace(/\n/g, '</br>');
  singleMeal.insertAdjacentHTML(
    'afterbegin',
    `
    <div class="single-meal--container">
      <div class="single-meal--headline">
        <sub>${recipe.mealOrigin} cuisine</sub>
        <h2>${recipe.title}</h2>
      </div>
      <div class="single-meal--section1">
        <img
          id="${recipe.id + recipe.mealOrigin}"
          src="img/spinner.svg"
          alt="${recipe.title}"
        />
        <div>
          <h3>Ingredients</h3>
          <ul>
            ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
          </ul>
        </div>
      </div>
      <div class="single-meal--section2">
        <div>
          <h3>Cooking Instructions</h3>
          <p>${instructions}</p>
        </div>
        ${recipe.youTube ? generateYouTubeMarkup(recipe.youTube) : ''}
      </div>
    </div>
  `
  );
  displayResolvedImage(recipe.image, recipe.id + recipe.mealOrigin);
};

const generateYouTubeMarkup = function (videoURL) {
  const embed = videoURL.replace('watch?v=', 'embed/');
  return `
    <div class="videoWrapper">
      <iframe
        width="720"
        height="381"
        src="${embed}"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      ></iframe>
    </div>
  `;
};

const renderSpinner = function () {
  const markup = `
    <div class="spinner-container">
      <img src="img/spinner.svg" alt="" />
    </div>
  `;

  mainEl.insertAdjacentHTML('beforeend', markup);
};

const removeSpinner = function () {
  const spinner = document.querySelector('.spinner-container');
  if (spinner) spinner.remove();
};

const awaitLoadImage = async function (url, element) {
  return new Promise((resolve, reject) => {
    element.onload = () => resolve(url);
    element.onerror = reject;
  });
};

const displayResolvedImage = async function (url, id) {
  const idEl = document.getElementById(id);
  const image = await awaitLoadImage(url, idEl);
  idEl.src = image;
};

const renderError = function (error) {
  showError.classList.add('show');
  setTimeout(() => {
    showError.classList.remove('show');
  }, 5000);

  document
    .querySelector('.close-icon')
    .addEventListener('click', () => showError.classList.remove('show'));

  document.querySelector('.error-text').textContent = error;
  singleMeal.innerHTML = '';
  resultsHeading.innerHTML = '';
  mealsEl.innerHTML = '';
  removeSpinner();
};

const showResultElements = function (el1, el2) {
  [el1, el2].forEach(event => event.classList.remove('hidden'));
  backBtn.classList.add('hidden');
};

const hideResultElements = function (el1, el2, showBtn = true) {
  [el1, el2].forEach(event => event.classList.add('hidden'));
  !showBtn
    ? backBtn.classList.add('hidden')
    : backBtn.classList.remove('hidden');
};

// Event Listeners

const mainEl = document.querySelector('.container');
const submitBtn = document.getElementById('submit');
const randomBtn = document.getElementById('random');
const searchInput = document.getElementById('search');
const resultsHeading = document.getElementById('result-heading');
const mealsEl = document.getElementById('meals');
const brandingEl = document.getElementById('branding');
const backBtn = document.getElementById('back-btn');
const singleMeal = document.getElementById('single-meal');
const showError = document.querySelector('.render-error');

submitBtn.addEventListener('submit', function (e) {
  e.preventDefault();
  showResultElements(mealsEl, resultsHeading);
  displaySearchResults(searchInput.value);
});

randomBtn.addEventListener('click', async function (e) {
  e.preventDefault();
  brandingEl.classList.replace('branding--load', 'branding--results');
  hideResultElements(mealsEl, resultsHeading);
  await displayRecipeResults('?random');
  window.location.hash = app.model.state.recipe.id;
});

backBtn.addEventListener('click', function (e) {
  e.preventDefault();
  if (app.model.state.search.results.length === 0) {
    brandingEl.classList.replace('branding--results', 'branding--load');
    window.location.hash = '';
    hideResultElements(mealsEl, resultsHeading, false);
    singleMeal.innerHTML = '';
  } else {
    generateSearchResultsMarkup(
      app.model.state.search.results,
      app.model.state.search.query
    );
    showResultElements(mealsEl, resultsHeading);
    window.location.hash = '';
    singleMeal.innerHTML = '';
  }
});

mealsEl.addEventListener('click', function (e) {
  const meals = e.target.closest('.meals--search-results');
  if (!meals) return;

  const id = meals.dataset.id;
  hideResultElements(mealsEl, resultsHeading);
  displayRecipeResults(+id);
});

['load', 'hashchange'].forEach(ev =>
  window.addEventListener(ev, function () {
    const id = window.location.hash.slice(1);
    if (!id) return;
    brandingEl.classList.replace('branding--load', 'branding--results');
    hideResultElements(mealsEl, resultsHeading);
    displayRecipeResults(+id);
  })
);
