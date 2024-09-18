document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product-list');
    let productsFromLocalStorage = JSON.parse(localStorage.getItem('products')) || [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function renderProducts() {
        productContainer.innerHTML = '';

        productsFromLocalStorage.forEach((product, index) => {
            const productDiv = createProductElement(product, index);
            productContainer.appendChild(productDiv);
        });

        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });

        updateCartDisplay();

        document.querySelector('.close').addEventListener('click', (event) => {
            event.preventDefault();
            document.body.classList.remove('showCart');
        });

        const popup = document.getElementById('order-popup');
        const closePopup = document.querySelector('.close-popup');

        document.querySelector('.checkout').addEventListener('click', (event) => {
            event.preventDefault();

            let orders = JSON.parse(localStorage.getItem('orders')) || [];

            const newOrder = {
                items: cart,
                date: new Date().toISOString(),
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };
            orders.push(newOrder);

            localStorage.setItem('orders', JSON.stringify(orders));

            cart = [];
            updateCartDisplay();
            saveCartToLocalStorage();

            popup.style.display = 'block';
        });
        closePopup.addEventListener('click', () => {
            popup.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === popup) {
                popup.style.display = 'none';
            }
        });
    }

    function createProductElement(product, index) {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.imgUrl}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price} €</p>
            <button class="add-to-cart" data-id="${index}" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>`;

        return productDiv;
    }

    function addToCart(event) {
        event.preventDefault();
        const button = event.target;
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));

        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity++;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        updateCartDisplay();
        saveCartToLocalStorage();

        document.body.classList.add('showCart');
    }

    function updateCartDisplay() {
        const listCart = document.querySelector('.listCart');
        listCart.innerHTML = '';

        let totalPrice = 0;

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'item';

            if (productsFromLocalStorage[item.id]) {
                cartItem.innerHTML = `
                    <img src="${productsFromLocalStorage[item.id].imgUrl}" alt="${item.name}" style="width: 70px; height: auto;">
                    <div>${item.name}</div>
                    <div>${item.price.toFixed(2)} €</div>
                    <div class="quantity">
                        <span class="decrease" data-id="${item.id}">-</span>
                        <span>${item.quantity}</span>
                        <span class="increase" data-id="${item.id}">+</span>
                    </div>`;
            } else {
                cartItem.innerHTML = `<div>Product not found</div>`;
            }

            listCart.appendChild(cartItem);
            totalPrice += item.price * item.quantity;
        });

        const totalElement = document.createElement('div');
        totalElement.className = 'total';
        totalElement.innerHTML = `Total: <strong>${totalPrice.toFixed(2)} €</strong>`;
        listCart.appendChild(totalElement);

        updateCartCount();

        if (cart.length > 0) {
            document.body.classList.add('showCart');
        } else {
            document.body.classList.remove('showCart');
        }

        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });
        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });

        document.querySelector('.cartTab .listCart').addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }


    function increaseQuantity(event) {
        event.preventDefault();
        const id = event.target.getAttribute('data-id');
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity++;
            updateCartDisplay();
            saveCartToLocalStorage();
        }
    }

    function decreaseQuantity(event) {
        event.preventDefault();
        const id = event.target.getAttribute('data-id');
        const item = cart.find(item => item.id === id);
        if (item && item.quantity > 1) {
            item.quantity--;
            updateCartDisplay();
            saveCartToLocalStorage();
        } else if (item && item.quantity === 1) {
            cart = cart.filter(item => item.id !== id);
            updateCartDisplay();
            saveCartToLocalStorage();
        }
    }

    function saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    document.querySelector('.shopping-cart').addEventListener('click', (event) => {
        event.preventDefault();
        document.body.classList.add('showCart');
    });

    renderProducts();
});
