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
      ingredients: this._createIngredientsArray(recipe),
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

  _createIngredientsArray(data) {
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

class View {
  mainEl = document.querySelector('.container');
  submitBtn = document.getElementById('submit');
  randomBtn = document.getElementById('random');
  searchInput = document.getElementById('search');
  resultsHeading = document.getElementById('result-heading');
  mealsEl = document.getElementById('meals');
  brandingEl = document.getElementById('branding');
  backBtn = document.getElementById('back-btn');
  singleMeal = document.getElementById('single-meal');
  showError = document.querySelector('.render-error');

  generateSearchResultsMarkup(results, searchTerm) {
    this.removeSpinner();
    this.singleMeal.innerHTML = '';
    this.resultsHeading.innerHTML = `<h2>Here are the results for ${searchTerm}...</h2>`;
    this.mealsEl.innerHTML = '';
    this.brandingEl.classList.replace('branding--load', 'branding--results');
    this.showError.classList.remove('show');
    this.searchInput.value = '';
    this.searchInput.blur();

    results.forEach(recipe => {
      const styledTitle =
        recipe.title.length > 25
          ? recipe.title.substring(0, 25) + '...'
          : recipe.title;
      this.mealsEl.insertAdjacentHTML(
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
                <h3><a href="#${recipe.id}">${styledTitle}</a></h3>
                <sub>Cuisine: ${recipe.mealOrigin}</sub>
              </div>`
      );
      app.view.displayResolvedImage(recipe.image, recipe.id);
    });
  }

  generateRecipeMarkup(recipe) {
    this.removeSpinner();
    this.singleMeal.innerHTML = '';
    const instructions = recipe.instructions.replace(/\n/g, '</br>');
    this.singleMeal.insertAdjacentHTML(
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
          ${recipe.youTube ? this.generateYouTubeMarkup(recipe.youTube) : ''}
        </div>
      </div>
    `
    );
    this.displayResolvedImage(recipe.image, recipe.id + recipe.mealOrigin);
  }

  generateYouTubeMarkup(videoURL) {
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
  }

  renderSpinner() {
    const markup = `
      <div class="spinner-container">
        <img src="img/spinner.svg" alt="" />
      </div>
    `;

    this.mainEl.insertAdjacentHTML('beforeend', markup);
  }

  removeSpinner() {
    const spinner = document.querySelector('.spinner-container');
    if (spinner) spinner.remove();
  }

  async _awaitLoadImage(url, element) {
    return new Promise((resolve, reject) => {
      element.onload = () => resolve(url);
      element.onerror = reject;
    });
  }

  async displayResolvedImage(url, id) {
    const idEl = document.getElementById(id);
    const image = await this._awaitLoadImage(url, idEl);
    idEl.src = image;
  }

  renderError(error) {
    this.showError.classList.add('show');
    setTimeout(() => {
      this.showError.classList.remove('show');
    }, 5000);

    document
      .querySelector('.close-icon')
      .addEventListener('click', () => this.showError.classList.remove('show'));

    document.querySelector('.error-text').textContent = error;
    this.singleMeal.innerHTML = '';
    this.resultsHeading.innerHTML = '';
    this.mealsEl.innerHTML = '';
    this.removeSpinner();
  }

  showResultElements(el1, el2) {
    [el1, el2].forEach(event => event.classList.remove('hidden'));
    this.backBtn.classList.add('hidden');
  }

  hideResultElements(el1, el2, showBtn = true) {
    [el1, el2].forEach(event => event.classList.add('hidden'));
    !showBtn
      ? this.backBtn.classList.add('hidden')
      : this.backBtn.classList.remove('hidden');
  }

  bindSubmitBtn(handler) {
    this.submitBtn.addEventListener('submit', e => {
      e.preventDefault();
      this.showResultElements(this.mealsEl, this.resultsHeading);
      handler(this.searchInput.value);
    });
  }

  bindRandomBtn(handler) {
    this.randomBtn.addEventListener('click', async e => {
      e.preventDefault();
      this.brandingEl.classList.replace('branding--load', 'branding--results');
      this.hideResultElements(this.mealsEl, this.resultsHeading);
      await handler('?random');
      window.location.hash = app.model.state.recipe.id;
    });
  }

  bindRecipeLoad(handler) {
    ['load', 'hashchange'].forEach(ev =>
      window.addEventListener(ev, () => {
        const id = window.location.hash.slice(1);
        if (!id) return;
        this.brandingEl.classList.replace(
          'branding--load',
          'branding--results'
        );
        this.hideResultElements(this.mealsEl, this.resultsHeading);
        handler(+id);
      })
    );
  }

  bindRecipeClick(handler) {
    this.mealsEl.addEventListener('click', e => {
      const meals = e.target.closest('.meals--search-results');
      if (!meals) return;

      const id = meals.dataset.id;
      this.hideResultElements(this.mealsEl, this.resultsHeading);
      handler(+id);
    });
  }

  bindBackBtn() {
    this.backBtn.addEventListener('click', e => {
      e.preventDefault();
      if (app.model.state.search.results.length === 0) {
        this.brandingEl.classList.replace(
          'branding--results',
          'branding--load'
        );
        window.location.hash = '';
        this.hideResultElements(this.mealsEl, this.resultsHeading, false);
        this.singleMeal.innerHTML = '';
      } else {
        this.generateSearchResultsMarkup(
          app.model.state.search.results,
          app.model.state.search.query
        );
        this.showResultElements(this.mealsEl, this.resultsHeading);
        window.location.hash = '';
        this.singleMeal.innerHTML = '';
      }
    });
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.view.bindSubmitBtn(this.displaySearchResults);
    this.view.bindRandomBtn(this.displayRecipeResults);
    this.view.bindRecipeLoad(this.displayRecipeResults);
    this.view.bindRecipeClick(this.displayRecipeResults);
    this.view.bindBackBtn();
  }

  displaySearchResults = async searchTerm => {
    try {
      this.view.renderSpinner();
      const data = await this.model.mealSearch(searchTerm);
      if (!data?.meals) throw 'Oops! No results found. Please try again! 🍔';

      await this.model.createSearchResultsObject(data);
      const results = this.model.state.search.results;
      this.model.state.search.query = searchTerm;
      this.view.generateSearchResultsMarkup(results, searchTerm);
    } catch (err) {
      this.view.renderError(err);
    }
  };

  displayRecipeResults = async searchID => {
    try {
      this.view.renderSpinner();
      const data = await this.model.mealSearch(searchID);
      const recipe = await this.model.createRecipeObject(data);
      this.model.state.recipe = recipe;
      this.view.generateRecipeMarkup(recipe);
    } catch (err) {
      this.view.renderError(err);
    }
  };
}

const app = new Controller(new Model(), new View());
