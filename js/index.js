const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const cocktailList = document.querySelector('#cocktail-list');
const modal = document.querySelector('.modal');

const loader = document.querySelector('#preloader');
loader.style.display = 'none';


const request = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    loader.style.display = 'none'
    throw Error('request error:' + response.status);
  }
  return await response.json();
};


async function getCocktails(query) {
  try {
    const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`;
    const data = await request(url);
    return data.drinks;
  } catch (error) {
    console.log(error);
  }
}

async function showCocktails(cocktails) {
  cocktailList.innerHTML = '';
  try {
    cocktails.forEach(cocktail => {
      const listItem = document.createElement('div');
      listItem.setAttribute('data-bs-toggle', 'modal');
      listItem.setAttribute('data-bs-target', '#exampleModal');
      listItem.innerHTML = `
      <div class="col">
        <div class="card text-bg-dark h-100">
        <img src="${cocktail.strDrinkThumb}" class="card-img-top" alt="${cocktail.strDrink}">
          <div class="card-body">
      <h2 class="cocktail-title fs-4">${cocktail.strDrink}</h2>
          </div>
        </div>
      </div>
      `;
      cocktailList.append(listItem);
      listItem.addEventListener('click', async () => await renderModal(cocktail));
    });
  } catch (error) {
    console.log(error);
    cocktailList.innerHTML = `<div class="alert alert-danger" role="alert">
    Nothing found!
    Please enter a more correct query
    </div>`;
  }
}

async function getIngredientImage(name) {
  try {
    const url = (`https://www.thecocktaildb.com/images/ingredients/${name}-Small.png`);
    const response = await fetch(url);
    if (response.ok) {
      return response.url;
    } else {
      throw new Error('Unable to load ingredient image');
    }
  } catch (error) {
    console.log(error);
  }
}

async function getListIngredients(cocktail, ingredientList) {
  for (let i = 1; i <= 15; i++) {
    if (cocktail[`strIngredient${i}`]) {
      const ingredient = document.createElement('li');
      const ingredientName = cocktail[`strIngredient${i}`];
      const ingredientImg = await getIngredientImage(ingredientName);
      if (cocktail[`strMeasure${i}`]) {
        const ingredientMeasure = cocktail[`strMeasure${i}`];
        ingredient.innerHTML = `<img src="${ingredientImg}" alt="${ingredientName}" class="ingredient-img"><b>${ingredientName}</b> (${ingredientMeasure})`;
        ingredientList.append(ingredient);
      } else {
        ingredient.innerHTML = `<img src="${ingredientImg}" alt="${ingredientName}" class="ingredient-img">${ingredientName}`;
        ingredientList.append(ingredient);
      }
    } else {
      break;
    }
  }
}


async function renderModal(cocktail) {
  const modalContent = document.querySelector('.modal-body');
  modalContent.innerHTML = '';
  const modalTitle = document.querySelector('.modal-title');
  modalTitle.textContent = `Cocktail Info - ${cocktail.strDrink}`;
  const ingredientList = document.createElement('ul');
  const modalInstructions = document.createElement('div');
  ingredientList.innerHTML = ('<h3>Ingredients:</h3>');
  modalInstructions.innerHTML = (`<h3>Instructions:</h3>
   <p>${cocktail.strInstructions}</p>`);
  modalContent.append(ingredientList);
  modalContent.append(modalInstructions);
  await getListIngredients(cocktail, ingredientList);
}

async function toSubmit(event) {
  loader.style.display = 'block';
  event.preventDefault();
  const query = searchInput.value.trim();
  if (query !== '') {
    const cocktails = await getCocktails(query);
    showCocktails(cocktails);
  } else {
    cocktailList.innerHTML = `<div class="alert alert-danger" role="alert">
    Nothing found!
    Please enter a more correct query
    </div>`;
  }
  loader.style.display = 'none';
}


searchForm.addEventListener("submit", toSubmit)
