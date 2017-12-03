const app = {
  loadingIndicator: document.querySelector('.loading-indicator'),
  cardsContainer: document.querySelector('.cards-container'),

  getCafeList() {
    return new Promise(((resolve) => {
      const request = new XMLHttpRequest();

      request.onreadystatechange = function handleResponse() {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status === 200) resolve(request.response);
        }
      };

      request.open('GET', 'https://api.myjson.com/bins/193mab');
      request.send();
    }));
  },

  searchCafe(cafeList, keyword) {
    const foundCafeList = [];

    cafeList.forEach((cafe) => {
      if (this.matchLocation(cafe.location, keyword)) foundCafeList.push(cafe);
    });

    return foundCafeList;
  },

  matchLocation(location, keyword) {
    let charIndex = 0;

    for (let i = 0; i < location.length; i += 1) {
      if (charIndex < keyword.length) {
        if (location.charAt(i).toLowerCase() !== keyword.charAt(charIndex).toLowerCase()) {
          charIndex = 0;
        } else {
          charIndex += 1;
        }

        if (keyword.charAt(charIndex) === undefined) break;
      }
    }

    return charIndex === keyword.length;
  },

  createCard(cafe) {
    const card = document.createElement('li');
    const cafeName = document.createElement('h2');

    const coffeeTaste = this.createCardProperty('coffee-taste', 'Rasa Kopinya', cafe.coffeeTaste);
    const price = this.createCardProperty('price', 'Harga', cafe.price);
    const location = this.createCardProperty('location', 'Lokasi', cafe.location);

    card.className = 'card';
    cafeName.className = 'card-heading';
    cafeName.textContent = cafe.name;

    card.appendChild(cafeName);
    card.appendChild(coffeeTaste);
    card.appendChild(price);
    card.appendChild(location);

    return card;
  },

  createCardProperty(className, attributeContent, valueContent) {
    const property = document.createElement('div');
    const attribute = property.cloneNode(true);
    const value = property.cloneNode(true);

    property.className = className;

    attribute.className = 'attribute';
    attribute.textContent = attributeContent;
    property.appendChild(attribute);

    value.className = 'value';
    value.textContent = valueContent;
    property.appendChild(value);

    return property;
  },

  fillCardsContainer(cafeList) {
    cafeList.forEach(cafe => this.cardsContainer.appendChild(this.createCard(cafe)));
  },

  clearCardsContainer() {
    while (this.cardsContainer.firstChild) {
      this.cardsContainer.removeChild(this.cardsContainer.firstChild);
    }
  },

  createSearchAlert(keyword) {
    const alert = document.createElement('div');

    alert.className = 'alert';
    alert.textContent = `Sementara ini belum ada warung kopi yang terdaftar di daerah ${keyword}`;

    return alert;
  },

  showSearchAlert(keyword) {
    return document.querySelector('main').insertBefore(this.createSearchAlert(keyword), this.cardsContainer);
  },

  showSearchResult(keyword, foundCafeList) {
    this.loadingIndicator.classList.add('hidden');

    if (foundCafeList.length === 0) return this.showSearchAlert(keyword);

    if (this.cardsContainer.classList.contains('hidden')) this.cardsContainer.classList.remove('hidden');

    return this.fillCardsContainer(foundCafeList);
  },
};

document.querySelector('input').addEventListener('change', (event) => {
  const keyword = event.target.value.trim();
  const header = document.querySelector('main header');
  const cards = app.cardsContainer;
  const alert = document.querySelector('.alert');

  // Check whether the search keyword is empty
  if (keyword === '') return false;

  // Remove the alert if the document contain it
  if (document.body.contains(alert)) alert.remove();

  // Clear the cards container if it not empty
  if (cards.hasChildNodes()) app.clearCardsContainer();

  // Add class `main-header-static` to the main header
  header.className = 'main-header-static';

  // Hide the main heading description
  header.querySelector('.main-heading div').className = 'hidden';

  // Show the app loading indicator
  app.loadingIndicator.classList.remove('hidden');

  return app.getCafeList()
    .then(JSON.parse)
    .then(response => app.searchCafe(response.cafeList, keyword))
    .then(foundCafeList => app.showSearchResult(keyword, foundCafeList));
});

window.addEventListener('scroll', () => {
  const searchInput = document.querySelector('.search-input');

  // Add the`sticky` classes after the window scroller reaching a particular vertical coordinate
  if (window.scrollY >= 80) {
    document.body.className = 'body-sticky';
    return searchInput.classList.add('search-input-sticky');
  }

  // Remove the `sticky` classes
  document.body.removeAttribute('class');
  return searchInput.classList.remove('search-input-sticky');
});
