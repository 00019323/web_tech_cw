const openBtn = document.querySelector(".cart-btn");
const closeBtn = document.querySelector(".close-btn");
const sidebar = document.querySelector(".sidebar");
const cartCounter = document.querySelector(".cart-counter");
const hamMenu = document.querySelector(".hamburger-menu");
const navigation = document.querySelector(".navbar");
const header = document.querySelector(".header");

const legalTxt = document.querySelector(".disclaimer");
let cart = [];
let counter = 0;
const addToCart = (id) => {
  const products = JSON.parse(localStorage.getItem("products"));
  const savedCart = JSON.parse(localStorage.getItem("cart"));
  // if we are not in products page, use saved cart
  if (!document.URL.includes("products")) {
    cart = savedCart;
  }
  const item = products.find((product) => product.id === id);
  const cartItem = cart.find((item) => item.id === id);
  if (cartItem) {
    cart.map((item) => {
      if (item.id === id) {
        item.quantity++;
      }
    });
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  counter++;
  cartCounter.innerHTML = counter;
  saveToMemory();
};
const removeFromCart = (id) => {
  const products = JSON.parse(localStorage.getItem("products"));
  const savedCart = JSON.parse(localStorage.getItem("cart"));
  // if we are not in products page, use saved cart
  if (!document.URL.includes("products.html")) {
    cart = savedCart;
  }
  if (cart.length === 0) {
    cartCounter.innerHTML = "";
    return;
  }
  const cartItem = cart.find((item) => item.id === id);
  if (cartItem.quantity > 1) {
    cart.map((item) => {
      if (item.id === id) {
        item.quantity--;
      }
    });
  } else {
    cart = cart.filter((item) => item.id !== id);
  }
  counter--;
  cartCounter.innerHTML = counter;
  saveToMemory();
  cartToHTML();
};

const saveToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const cartToHTML = () => {
  const savedCart = JSON.parse(localStorage.getItem("cart"));
  if (!savedCart) if(savedCart.length>0) counter = cart.map((item) => item.quantity).reduce((a, b) => a + b);
  cartCounter.innerHTML = counter;
  cart = savedCart;
  const cartList = document.querySelector(".cart-list");
  const cartBody = document.querySelector(".sidebar-content");
  cartList.innerHTML = "";
  if (cart.length === 0) {
    const emptyCart = document.createElement("div");
    emptyCart.classList.add("empty-cart");
    emptyCart.innerHTML = `
    <h3 class="empty-cart_title">Your cart is empty</h3>
    <p class="empty-cart_text">Looks like you haven't added any items to the cart yet.</p>
    <br/>
    `;
    cartList.appendChild(emptyCart);
  }
  let cartTotal = 0;
  cart.map((item) => {
    cartTotal += item.price * item.quantity;
  });
  const cartTotalEL = document.createElement("div");
  cartTotalEL.classList.add("cart-total");
  cart.map((product) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
    <div class="cart-item_img">
      <img src="${product.url}" alt="${product.title}" />
    </div>
    <div class="cart-item_content">
        <div class="cart-item_text">
            <h3 class="cart-item_title">${product.title}</h3>
            <span class="cart-item_brand">${product.brand}</span>
        </div>
        <div class="cart-item_quantity">
            <span class="cart-item_quantity-title">Quantity</span>
            <span class="cart-item_quantity-value">${product.quantity}</span>
        </div>
        <p class="cart-item_price">$${product.price}</p>
        </div>
        <div class="cart-item_buttons">
      <button data=${product.id} class="btn btn-primary cart-remove">
        <i class="fas fa-minus"></i>
      </button>
      <button data=${product.id} class="btn btn-primary cart-add">
        <i class="fas fa-plus"></i>
      </button>
    </div>
  `;
    cartList.appendChild(cartItem);
  });
  cartTotalEL.innerHTML = `
  <div class="cart-total_content">
    <span class="cart-total_title">Total</span>
    <span class="cart-total_value">$${cartTotal}</span>
  </div>
  <button class="btn btn-primary cart-checkout">Checkout</button>
  `;
  if (document.querySelector(".cart-total")) {
    document.querySelector(".cart-total").remove();
  }
  cartBody.appendChild(cartTotalEL);
  const addBtn = document.querySelectorAll(".cart-add");
  const removeBtn = document.querySelectorAll(".cart-remove");
  addBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = Number(btn.getAttribute("data"));
      addToCart(id);
      cartToHTML();
    });
  });
  removeBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      console.log("remove");
      const id = Number(btn.getAttribute("data"));
      removeFromCart(id);
      cartToHTML();
    });
  });
};

if (document.URL.includes("products")) {
  fetch("../data/products.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((products) => {
      // Save products and cart to local storage
      localStorage.setItem("products", JSON.stringify(products));
      localStorage.setItem("cart", JSON.stringify(cart));
      // Products list generator
      const productsList = document.querySelector(".products-list");
      products.map((product) => {
        const productItem = document.createElement("div");
        productItem.classList.add("product-card");
        productItem.innerHTML = `
    <div class="product-card_img">
      <img src="${product.url}" alt="${product.title}" />
    </div>
    <div class="product-card_content">
        <div class="product-card_text">
            <h3 class="product-card_title">${product.title}</h3>
            <span class="product-card_brand">${product.brand}</span>
        </div>
      <p class="product-card_price">$${product.price}</p>
      <button data=${product.id} class="btn btn-primary add-to-cart">Add to cart</button>
    </div>
  `;
        productsList.appendChild(productItem);
      });
      const cartBtn = document.querySelectorAll(".add-to-cart");
      cartBtn.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = Number(btn.getAttribute("data"));
          addToCart(id, products);
          cartToHTML();
        });
      });
    })
    .catch((error) => {
      // Handle errors
      console.error("Error fetching the JSON file:", error);
    });
}

openBtn.addEventListener("click", function () {
  sidebar.classList.add("show-sidebar");
  cartToHTML();
});
closeBtn.addEventListener("click", function () {
  sidebar.classList.remove("show-sidebar");
});

const toggleHamburgerMenu = () => {
  navigation.classList.toggle("show");
  legalTxt.classList.toggle("hidden");
  // if .show class has been added to navigation, change ham menu icon to close icon
  if (navigation.classList.contains("show")) {
    hamMenu.innerHTML = `<i class="fas fa-times"></i>`;
    header.setAttribute("style", "padding: 0px");
    hamMenu.setAttribute("style", "position: fixed");
  } else {
    header.setAttribute("style", "padding: 20px 0px");
    hamMenu.setAttribute("style", "position: flex");
    hamMenu.innerHTML = `<i class="fas fa-bars"></i>`;
  }
};

hamMenu.addEventListener("click", toggleHamburgerMenu);


const initCart = () => {
  const savedCart = JSON.parse(localStorage.getItem("cart"));
  if (savedCart) {
    savedCart.map((item) => {
      counter += item.quantity;
    });
    cartCounter.innerHTML = counter;
    cart = savedCart;
    cartToHTML();
  }
};
initCart();
