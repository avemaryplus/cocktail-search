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


