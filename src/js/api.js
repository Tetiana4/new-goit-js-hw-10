import countryCard from '../templates/card.hbs'
import cardSet from '../templates/set.hbs'
import Notiflix from "notiflix"
import { refs } from './refs'

var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const url = 'https://restcountries.eu/rest/v2/name/';
const list = 'fields=name;capital;population;flag;languages';

refs.inputSearch.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
    if (this.value === '') {
        return Notiflix.Notify.failure('Please enter country');
    };
    fetch(`${url}${this.value}?${list}`)
        .then(response => {
            return response.json()
        })
        .then(country => {
            refs.countryList.innerHTML = '';
            if (country.status === 404) {
                Notiflix.Notify.failure('Oops, there is no country with that name');
            } else if (country.length === 1) {
                refs.countryList.insertAdjacentHTML('beforeend', countryCard(country));
            } else if (country.length > 1 && country.length <= 10) {
                refs.countryList.insertAdjacentHTML('beforeend', cardSet(country));
            } else {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');  
            }
    }).catch(error => {
        console.log(error)
    });
}