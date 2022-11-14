import './css/styles.css';
import fetchCountries from './js/fetchCountries.js';
import Notiflix from 'notiflix';
import Lodash from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', Lodash(onInputField, DEBOUNCE_DELAY));

function onInputField(e) {
  e.preventDefault();

  const countries = e.target.value.trim();

  if (countries === '') {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
    return;
  }

  fetchCountries(countries)
    .then(renderCounriesInfo)
    .catch(error =>
      Notiflix.Notify.failure('Oops, there is no country with that name!')
    );
}

function renderCounriesInfo(countries) {
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    refs.countryList.innerHTML = '';
  }

  const markup = countries
    .map(({ name, capital, population, flags, languages }) => {
      return `<img src="${flags.svg}" alt="${name}" width="50px">
      <h1 class="country-name">${name}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${languages.map(e => e.name)}</p>`;
    })
    .join('');
  refs.countryInfo.innerHTML = markup;

  if (countries.length > 1) {
    refs.countryInfo.innerHTML = '';
  }

  renderCounriesList(countries);
}

function renderCounriesList(countries) {
  if (countries.length >= 2 && countries.length <= 10) {
    const markup = countries
      .map(({ name, flags }) => {
        return `<li>
      <img src="${flags.svg}" alt="${name}" width="50px">
      <p class="country-name"><b>${name}</b>
    </li>`;
      })
      .join('');
    refs.countryList.innerHTML = markup;
  }

  if (countries.length === 1) {
    refs.countryList.innerHTML = '';
  }
}
