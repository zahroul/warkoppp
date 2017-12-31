const app = {
  loadingIndicator: document.querySelector('.loading-indicator'),
  cafeList: document.getElementById('cafe-list'),

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

      request.open('GET', 'https://api.myjson.com/bins/14wjjv');
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
   * Creates a cafe item element based on the passed in cafe list item
   *
   * @param cafeListItem
   * @returns {HTMLLIElement}
   */
  createCafeItem(cafeListItem) {
    const cafeItem = document.getElementById('cafe-item-template').content.cloneNode(true);
    const propertyList = cafeItem.querySelector('ul');
    const buttonLike = propertyList.children[1].querySelector('button');

    cafeItem.querySelector('h2').textContent = cafeListItem.name;

    propertyList.children[0].innerHTML += cafeListItem.location;

    buttonLike.innerHTML += `<span>${cafeListItem.likes.length}</span>`;
    buttonLike.addEventListener('click', this.showDialog);

    return cafeItem;
  },

  /**
   * Fill in the cafe list element with the passed in cafe list items
   *
   * @param cafeListItems
   */
  fillCafeList(cafeListItems) {
    cafeListItems.forEach((cafeListItem) => {
      this.cafeList.appendChild(this.createCafeItem(cafeListItem));
    });
  },

  /**
   * Clear the cafe list element
   */
  clearCafeList() {
    while (this.cafeList.firstChild) {
      this.cafeList.removeChild(this.cafeList.firstChild);
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
   * Shows the search result for the passed in cafe list items and location keyword
   *
   * @param keyword
   * @param cafeListItems
   * @returns {*}
   */
  showSearchResult(cafeListItems, keyword) {
    // Hide the search loading indicator
    this.loadingIndicator.setAttribute('hidden', '');

    if (cafeListItems.length === 0) {
      // Shows the search alert if the cafe data is empty
      document.querySelector('main').insertBefore(this.createSearchAlert(keyword), this.cafeList);
    } else {
      // Fill in the cafe list element
      this.fillCafeList(cafeListItems);
    }
  },

  showDialog() {
    const dialog = document.querySelector('[role="dialog"]');

    dialog.removeAttribute('hidden');
    dialog.querySelector('button').focus();
  },
};

document.querySelector('input').addEventListener('change', (event) => {
  const keyword = event.target.value.trim();
  const header = document.querySelector('main header');
  const alert = document.querySelector('.alert');

  // Checks whether the search keyword is empty
  if (keyword === '') return false;

  // Set the main element as the search result view
  document.querySelector('main').id = 'search-result';

  // Point the url to the search result view
  window.location.hash = 'search-result';

  // Remove the alert if the document contain it
  if (document.body.contains(alert)) alert.remove();

  // Clear the cafe list element if it not empty
  if (app.cafeList.hasChildNodes()) app.clearCafeList();

  // Hide the main heading description
  header.querySelector('h1 div').setAttribute('hidden', '');

  // Shows the app loading indicator
  app.loadingIndicator.removeAttribute('hidden');

  return app.getCafeList()
    .then(JSON.parse)
    .then(response => app.searchCafe(response.cafeList, keyword))
    .then(cafeListItems => app.showSearchResult(cafeListItems, keyword));
});

document.querySelector('[role="dialog"]').querySelector('button').addEventListener('click', () => {
  document.querySelector('[role="dialog"]').setAttribute('hidden', '');
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

window.addEventListener('click', (event) => {
  const dialog = document.querySelector('[role="dialog"]');

  if (event.target === dialog) dialog.setAttribute('hidden', '');
});
