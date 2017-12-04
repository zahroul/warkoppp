const app = {
  loadingIndicator: document.querySelector('.loading-indicator'),
  cardsContainer: document.querySelector('.cards-container'),

  /**
   * Gets the cafe list from an external data source
   *
   * @returns {Promise<any>}
   */
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

  /**
   * Searches through the passed in cafe list data by the passed in location keyword
   *
   * @param cafeList
   * @param keyword
   * @returns {Array}
   */
  searchCafe(cafeList, keyword) {
    const foundCafeList = [];

    cafeList.forEach((cafe) => {
      if (this.matchLocation(cafe.location, keyword)) foundCafeList.push(cafe);
    });

    return foundCafeList;
  },

  /**
   * Matches the passed in cafe location with the passed in location keyword
   *
   * @param location
   * @param keyword
   * @returns {boolean}
   */
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

  /**
   * Creates a card based on the passed in cafe data
   *
   * @param cafe
   * @returns {HTMLLIElement}
   */
  createCard(cafe) {
    const card = document.createElement('li');
    const cafeName = document.createElement('h2');
    const cafeProperties = [
      ['coffee-taste', 'Rasa Kopinya', cafe.coffeeTaste],
      ['price', 'Harga', cafe.price],
      ['location', 'Lokasi', cafe.location],
    ];

    card.className = 'card';
    cafeName.className = 'card-heading';
    cafeName.textContent = cafe.name;
    card.appendChild(cafeName);

    cafeProperties.forEach((property) => {
      const cardProperty = this.createCardProperty(property[0], property[1], property[2]);

      card.appendChild(cardProperty);
    });

    return card;
  },

  /**
   * Creates a cafe card property based on the passed in class name, attribute content,
   * and value content
   *
   * @param className
   * @param attributeContent
   * @param valueContent
   * @returns {HTMLDivElement}
   */
  createCardProperty(className, attributeContent, valueContent) {
    const property = document.createElement('div');
    const items = [
      ['attribute', attributeContent],
      ['value', valueContent],
    ];

    property.className = className;

    items.forEach((item) => {
      const propertyItem = document.createElement('span');
      const [attribute, value] = [item[0], item[1]];

      propertyItem.className = attribute;
      propertyItem.textContent = value;
      property.appendChild(propertyItem);
    });

    return property;
  },

  /**
   * Fill in the cards container with the passed in cafe list data
   *
   * @param cafeList
   */
  fillCardsContainer(cafeList) {
    cafeList.forEach(cafe => this.cardsContainer.appendChild(this.createCard(cafe)));
  },

  /**
   * Clear the cards container
   */
  clearCardsContainer() {
    while (this.cardsContainer.firstChild) {
      this.cardsContainer.removeChild(this.cardsContainer.firstChild);
    }
  },

  /**
   * Creates a search alert based on the passed in location keyword
   *
   * @param keyword
   * @returns {HTMLDivElement}
   */
  createSearchAlert(keyword) {
    const alert = document.createElement('div');

    alert.className = 'alert';
    alert.textContent = `Sementara ini belum ada warung kopi yang terdaftar di daerah ${keyword}`;

    return alert;
  },

  /**
   * Shows the search result for the passed in location keyword
   *
   * @param keyword
   * @param foundCafeList
   * @returns {*}
   */
  showSearchResult(foundCafeList, keyword) {
    // Hide the search loading indicator
    this.loadingIndicator.classList.add('hidden');

    // Shows the search alert if the found cafe list is empty
    if (foundCafeList.length === 0) return document.querySelector('main').insertBefore(this.createSearchAlert(keyword), this.cardsContainer);

    // Fill in the cards container
    this.fillCardsContainer(foundCafeList);

    // Shows the cards container
    return this.cardsContainer.classList.remove('hidden');
  },
};

document.querySelector('input').addEventListener('change', (event) => {
  const keyword = event.target.value.trim();
  const header = document.querySelector('main header');
  const cards = app.cardsContainer;
  const alert = document.querySelector('.alert');

  // Checks whether the search keyword is empty
  if (keyword === '') return false;

  // Remove the alert if the document contain it
  if (document.body.contains(alert)) alert.remove();

  // Clear the cards container if it not empty
  if (cards.hasChildNodes()) app.clearCardsContainer();

  // Add class `main-header-static` to the main header
  header.className = 'main-header-static';

  // Hide the main heading description
  header.querySelector('.main-heading div').className = 'hidden';

  // Shows the app loading indicator
  app.loadingIndicator.classList.remove('hidden');

  return app.getCafeList()
    .then(JSON.parse)
    .then(response => app.searchCafe(response.cafeList, keyword))
    .then(foundCafeList => app.showSearchResult(foundCafeList, keyword));
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
