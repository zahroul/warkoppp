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

    this.fillCafeCardsContainer(foundCafeList);
  },

  matchLocation(location, keyword) {
    let charIndex = 0;

    for (let i = 0; i < location.length; i += 1) {
      if (charIndex < keyword.length) {
        if (location.charAt(i).toLowerCase() !== keyword.charAt(charIndex)) {
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

    property.className = className;
    property.textContent = `${textContent}: `;
    property.appendChild(document.createElement('span'));

    return property;
  },

  addCafeCard(cafe) {
    const card = this.createCafeCard();

    card.querySelector('h2').textContent = cafe.name;
    card.querySelector('.coffee-taste span').textContent = cafe.coffeeTaste;
    card.querySelector('.price span').textContent = cafe.price;
    card.querySelector('.location span').textContent = cafe.location;

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
};

document.querySelector('input').addEventListener('change', (event) => {
  const keyword = event.target.value.trim().toLowerCase();
  const cardsContainer = app.cafeCardsContainer;

  if (keyword !== '') {
    if (cardsContainer.hasChildNodes()) app.clearCafeCardsContainer(cardsContainer);

    app.getCafeList().then(JSON.parse).then(response => app.searchCafe(response.cafeList, keyword));
  }
});
