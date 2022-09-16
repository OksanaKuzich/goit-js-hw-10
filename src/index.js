import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(event) {
  const country = event.target.value.trim();
  fetchCountries(country)
    .then(response => {
      if (response.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return (listEl.innerHTML = '');
      } else if (response.length > 1) {
        infoEl.innerHTML = '';
        return (listEl.innerHTML = markUpItems(response));
      } else if (response.length === 1) {
        markUpCard(response[0]);
        return (listEl.innerHTML = '');
      } else {
        return;
      }
    })
    .catch(error => {
      infoEl.innerHTML = '';
      listEl.innerHTML = '';
      Notify.failure('Oops, there is no country with that name');
    });
}

function markUpItems(item) {
  return item
    .map(({ flags, name }) => {
      return `<li><img src="${flags.svg}" alt="${name.official}" width=100px><p>${name.official}</p></li>`;
    })
    .join('');
}

function markUpCard(item) {
  infoEl.innerHTML = `<div class='card'><img class='flag' src="${item.flags.svg}" alt="${
    item.name.official
  }" width=300px><h2 class='name'>Назва країни: ${item.name.official}</h2>
      <p class='info'>Столиця: ${item.capital}</p>
      <p class='info'>Населення: ${(Math.round(item.population / 10_000)) / 100} млн чол.</p>
      <p class='info'>Мова: ${Object.values(item.languages)}</p><div>`;
}
