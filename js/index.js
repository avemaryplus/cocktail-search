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

