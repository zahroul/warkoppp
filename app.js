const app = {
  cafeCardsContainer: document.querySelector('ul'),

  getCafeList() {
    return new Promise(((resolve) => {
      const request = new XMLHttpRequest();

      request.onreadystatechange = function handleResponse() {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status === 200) resolve(request.response);
        }
      };

      request.open('GET', 'cafe-data.json');
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

  createCafeCard() {
    const cafeCard = document.createElement('li');
    const cafeName = document.createElement('h2');

    const cafeCoffeeTaste = this.createCafeCardProperty('coffee-taste', 'Rasa Kopinya');
    const cafePrice = this.createCafeCardProperty('price', 'Harga');
    const cafeLocation = this.createCafeCardProperty('location', 'Lokasi');

    cafeCard.appendChild(cafeName);
    cafeCard.appendChild(cafeCoffeeTaste);
    cafeCard.appendChild(cafePrice);
    cafeCard.appendChild(cafeLocation);

    return cafeCard;
  },

  createCafeCardProperty(className, textContent) {
    const property = document.createElement('div');
    const attribute = property.cloneNode(true);
    const value = property.cloneNode(true);

    property.className = className;

    attribute.className = 'attribute';
    attribute.textContent = textContent;
    property.appendChild(attribute);

    value.className = 'value';
    property.appendChild(value);

    return property;
  },

  addCafeCard(cafe) {
    const card = this.createCafeCard();

    card.querySelector('h2').textContent = cafe.name;
    card.querySelector('.coffee-taste .value').textContent = cafe.coffeeTaste;
    card.querySelector('.price .value').textContent = cafe.price;
    card.querySelector('.location .value').textContent = cafe.location;

    this.cafeCardsContainer.appendChild(card);
  },

  fillCafeCardsContainer(cafeList) {
    cafeList.forEach(cafe => app.addCafeCard(cafe));
  },

  clearCafeCardsContainer(cafeCardsContainer) {
    while (cafeCardsContainer.firstChild) {
      cafeCardsContainer.removeChild(cafeCardsContainer.firstChild);
    }
  },

  createSearchAlert(keyword) {
    const alert = document.createElement('div');

    alert.className = 'alert';
    alert.textContent = `Sementara ini belum ada warung kopi yang terdaftar di daerah ${keyword}`;

    return alert;
  },

  isAlertExist(alert) {
    return document.body.contains(alert);
  },

  showSearchAlert(keyword, cafeCardsContainer) {
    return document.querySelector('main').insertBefore(this.createSearchAlert(keyword), cafeCardsContainer);
  },

  showSearchResult(keyword, cafeCardsContainer, foundCafeList) {
    if (foundCafeList.length === 0) return this.showSearchAlert(keyword, cafeCardsContainer);

    return this.fillCafeCardsContainer(foundCafeList);
  },
};

document.querySelector('input').addEventListener('change', (event) => {
  const keyword = event.target.value.trim();
  const cardsContainer = app.cafeCardsContainer;
  const alert = document.querySelector('.alert');

  if (keyword === '') return false;

  if (app.isAlertExist(alert)) alert.remove();

  if (cardsContainer.hasChildNodes()) app.clearCafeCardsContainer(cardsContainer);

  return app.getCafeList()
    .then(JSON.parse)
    .then(response => app.searchCafe(response.cafeList, keyword))
    .then(foundCafeList => app.showSearchResult(keyword, cardsContainer, foundCafeList));
});
