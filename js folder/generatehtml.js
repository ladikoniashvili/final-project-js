const limit = 12;
let skip = 0;
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

function fetchData(searchQuery) {
  const categories = [];
  document.querySelectorAll('input[name="category"]:checked').forEach(checkbox => {
    categories.push(checkbox.value);
  });
  let url = `https://dummyjson.com/products${categories.length ? `/category/${categories.join(',')}` : ''}?limit=${limit}&skip=${skip}`;
  if (searchQuery) {
    url += `&q=${encodeURIComponent(searchQuery)}`;
  }
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const productsDiv = document.getElementById('products');
      productsDiv.innerHTML = '';
      for (let i = 0; i < data.products.length; i++) {
        const product = data.products[i];
        if (searchQuery && !product.title.toLowerCase().includes(searchQuery)) {
          continue;
        }
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
          <img class="mainimg"src="${product.thumbnail}" alt="best product">
          <h3>${product.title}</h3>
          <p>${product.price}$</p>
          <img class="heart" src="./images/heart.png" alt="lucky">
          <p class="info">Tap Image to get Info</p>
          

        `;
        productsDiv.appendChild(productDiv);
        productsDiv.appendChild(productDiv);
        const productImg = productDiv.querySelector('img');
        productImg.addEventListener("click", () => {
            openModal(product);
        });
        const heartIcon = productDiv.querySelector('.heart');
       const productId = product.id;
       if (localStorage.getItem(productId) === 'liked') {
       heartIcon.src = './images/thumb-up.png';
       };
      heartIcon.addEventListener("click", () => {
      heartIcon.src = './images/thumb-up.png';
      localStorage.setItem(productId, 'liked');
});
      };
    });
};

fetchData();

const pagination = document.querySelector('.pagination');
pagination.addEventListener('click', e => {
  e.preventDefault();

  if (e.target.tagName !== 'A') return;

  if (e.target.classList.contains('prev')) {
    if (skip > 0) {
      skip -= limit;
      fetchData();
      updateActivePage();
    }
  } else if (e.target.classList.contains('next')) {
    skip += limit;
    fetchData();
    updateActivePage();
  } else {
    skip = (parseInt(e.target.textContent) - 1) * limit;
    fetchData();
    updateActivePage();
  }
});

function updateActivePage() {
  const activePage = Math.ceil(skip / limit) + 1;
  const pages = document.querySelectorAll('.pagination a');
  pages.forEach(page => {
    if (page.textContent == activePage) {
      page.classList.add('active');
    } else {
      page.classList.remove('active');
    }
  });
};

document.querySelectorAll('input[name="category"]').forEach(checkbox => {
  checkbox.addEventListener('click', () => {
    skip = 0;
    fetchData();
    updateActivePage();
  });
});

searchButton.addEventListener('click', searchProducts);

function searchProducts() {
  const searchQuery = searchInput.value.trim().toLowerCase();
  skip = 0;
  fetchData(searchQuery);
  updateActivePage();
};





function openModal(product) {
  const modal = document.getElementById('product-modal');
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const productsDiv = document.getElementById('products');
  const productRating = document.getElementById("modal-rating");
  productsDiv.style.display = 'none';

  modalImage.src = product.images[0];
  modalTitle.textContent = product.title;
  modalDescription.textContent = product.description;
  productRating.textContent = product.rating + " " + "Rating";
  modal.style.display = 'block';

  const closeBtn = document.querySelector('.close');
   closeBtn.style = "font-size: 50px; position: fixed;right: 20%;top: 13%;color: #534caf; cursor: pointer";
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    productsDiv.style.display = 'flex';
  });

  window.addEventListener('click', event => {
    if (event.target == modal) {
      modal.style.display = 'none';
      productsDiv.style.display = "flex";
    }
  });
};