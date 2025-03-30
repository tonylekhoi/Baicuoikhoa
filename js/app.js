let currentIndex = 0;

// Slider functions
function showSlide(index) {
    const slides = document.querySelector('.slides');
    const totalSlides = document.querySelectorAll('.slide').length;
    if (index >= totalSlides) currentIndex = 0;
    if (index < 0) currentIndex = totalSlides - 1;
    slides.style.transform = `translateX(${-currentIndex * 100}%)`;
}

function moveSlide(direction) {
    currentIndex += direction;
    showSlide(currentIndex);
}

setInterval(() => {
    moveSlide(1);
}, 3000);

// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    const cart = [];
    const cartToggle = document.getElementById('cart-toggle');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const cartOverlay = document.createElement('div');
    cartOverlay.className = 'cart-overlay';
    document.body.appendChild(cartOverlay);

    // Toggle cart visibility
    cartToggle.addEventListener('click', function(e) {
        e.preventDefault();
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    });

    closeCart.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });

    cartOverlay.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });

    // Add to cart buttons
    document.querySelectorAll('.buy').forEach(button => {
        button.addEventListener('click', function() {
            const productElement = this.closest('.child');
            const product = {
                name: productElement.querySelector('.word').textContent,
                price: productElement.querySelector('.price').textContent,
                image: productElement.querySelector('img').src,
                quantity: 1
            };

            // Check if product already in cart
            const existingItem = cart.find(item => item.name === product.name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push(product);
            }

            updateCart();
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
        });
    });

    // Update cart UI
    function updateCart() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartCount = document.querySelector('.cart-count');
        const totalPriceElement = document.querySelector('.total-price');

        // Clear cart items
        cartItemsContainer.innerHTML = '';

        // Add items to cart
        let totalPrice = 0;
        let totalItems = 0;

        cart.forEach((item, index) => {
            totalItems += item.quantity;
            
            // Extract numeric price
            const priceNumber = parseInt(item.price.replace(/\D/g, '')) || 0;
            totalPrice += priceNumber * item.quantity;

            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price}</div>
                    <div class="cart-item-quantity">
                        <button class="decrease-quantity" data-index="${index}">-</button>
                        <input type="text" value="${item.quantity}" readonly>
                        <button class="increase-quantity" data-index="${index}">+</button>
                        <span class="remove-item" data-index="${index}">Xóa</span>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });

        // Update cart count and total price
        cartCount.textContent = totalItems;
        totalPriceElement.textContent = `${totalPrice.toLocaleString()} đ`;

        // Add event listeners to quantity buttons
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                    updateCart();
                }
            });
        });

        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart[index].quantity += 1;
                updateCart();
            });
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCart();
            });
        });
    }

    // Checkout button
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Giỏ hàng của bạn đang trống!');
            return;
        }
        alert('Đặt hàng thành công! Tổng tiền: ' + document.querySelector('.total-price').textContent);
        // Here you would typically send the cart data to your server
        cart.length = 0;
        updateCart();
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });
});