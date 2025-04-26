// --- Slider Functionality (Remains the same) ---
let currentIndex = 0;

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
// --- End Slider Functionality ---


// --- Unified Cart Functionality with LocalStorage ---
document.addEventListener('DOMContentLoaded', function () {

    // --- Core Cart Variables ---
    // Load cart from localStorage or initialize as empty array
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || []; 
    const cartToggle = document.getElementById('cart-toggle');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalPriceElement = document.querySelector('.total-price');
    const checkoutBtn = document.querySelector('.checkout-btn');

    // Check if essential cart elements exist before proceeding
    if (!cartToggle || !cartSidebar || !closeCart || !cartItemsContainer || !cartCount || !totalPriceElement || !checkoutBtn) {
        console.warn("Cart UI elements not found. Cart functionality disabled.");
        return; // Stop execution if cart elements are missing
    }

    // Create and append overlay (only once)
    const cartOverlay = document.createElement('div');
    cartOverlay.className = 'cart-overlay';
    document.body.appendChild(cartOverlay);

    // --- Helper Function to Save Cart ---
    function saveCartToLocalStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    // --- Toggle Cart Visibility ---
    cartToggle.addEventListener('click', function (e) {
        e.preventDefault();
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    });

    closeCart.addEventListener('click', function () {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });

    cartOverlay.addEventListener('click', function () {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });

    // --- Add to Cart Buttons (Handles both .child and .tiny) ---
    document.querySelectorAll('.buy').forEach(button => {
        button.addEventListener('click', function () {
            let productElement = this.closest('.child'); // Try finding .child first
            let product = null;

            if (productElement) {
                // Product structure type 1 (.child)
                product = {
                    // Use optional chaining (?) in case elements don't exist
                    name: productElement.querySelector('.word')?.textContent.trim(),
                    price: productElement.querySelector('.price')?.textContent.trim(),
                    image: productElement.querySelector('img')?.src,
                    quantity: 1
                };
            } else {
                productElement = this.closest('.tiny'); // Try finding .tiny if .child not found
                if (productElement) {
                    // Product structure type 2 (.tiny)
                    product = {
                        name: productElement.querySelector('.sentences')?.textContent.trim(),
                        price: productElement.querySelector('.money')?.textContent.trim(),
                        image: productElement.querySelector('img')?.src,
                        quantity: 1
                    };
                }
            }

            // Proceed only if product details were successfully extracted
            if (product && product.name && product.price && product.image) {
                // Check if product already in cart
                const existingItem = cart.find(item => item.name === product.name);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push(product);
                }

                updateCart(); // Update UI
                saveCartToLocalStorage(); // Save to localStorage
                cartSidebar.classList.add('active'); // Show cart
                cartOverlay.classList.add('active');
            } else {
                console.error("Could not extract product details from:", this.closest('.child, .tiny'));
            }
        });
    });

    // --- Update Cart UI Function ---
    function updateCart() {
        // Clear current cart display
        cartItemsContainer.innerHTML = ''; 

        let totalPrice = 0;
        let totalItems = 0;

        if (cart.length === 0) {
             cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Giỏ hàng của bạn đang trống.</p>';
        } else {
            cart.forEach((item, index) => {
                // Ensure item has necessary properties
                if (!item || typeof item.quantity !== 'number' || !item.price) {
                    console.warn("Invalid item in cart:", item);
                    // Optionally remove invalid item: cart.splice(index, 1); saveCartToLocalStorage(); updateCart(); return;
                    return; // Skip this invalid item
                }

                totalItems += item.quantity;

                // Extract numeric price robustly
                const priceString = String(item.price); // Ensure it's a string
                const priceNumber = parseInt(priceString.replace(/\D/g, '')) || 0; // Remove non-digits, parse, default to 0
                totalPrice += priceNumber * item.quantity;

                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <img src="${item.image || 'placeholder.png'}" alt="${item.name || 'Sản phẩm'}"> 
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name || 'Không tên'}</div>
                        <div class="cart-item-price">${item.price || '0 đ'}</div>
                        <div class="cart-item-quantity">
                            <button class="decrease-quantity" data-index="${index}" aria-label="Giảm số lượng">-</button>
                            <input type="text" value="${item.quantity}" readonly aria-label="Số lượng">
                            <button class="increase-quantity" data-index="${index}" aria-label="Tăng số lượng">+</button>
                            <span class="remove-item" data-index="${index}" role="button" tabindex="0" aria-label="Xóa sản phẩm">Xóa</span>
                        </div>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });
        }


        // Update cart count and total price display
        cartCount.textContent = totalItems;
        totalPriceElement.textContent = `${totalPrice.toLocaleString('vi-VN')} đ`; // Format for Vietnamese Dong

        // --- Re-add Event Listeners for dynamically created buttons ---
        addCartItemEventListeners();
    }

    // --- Function to Add Event Listeners to Cart Items ---
    function addCartItemEventListeners() {
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            // Remove old listener before adding new one to prevent duplicates
            button.replaceWith(button.cloneNode(true)); 
        });
        document.querySelectorAll('.decrease-quantity').forEach(button => {
             button.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index] && cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                    updateCart();
                    saveCartToLocalStorage();
                } else if (cart[index] && cart[index].quantity === 1) {
                    // Optional: Ask for confirmation before removing
                    // if (confirm(`Bạn có muốn xóa ${cart[index].name} khỏi giỏ hàng?`)) {
                        cart.splice(index, 1); // Remove item if quantity becomes 0
                        updateCart();
                        saveCartToLocalStorage();
                    // }
                }
            });
        });


        document.querySelectorAll('.increase-quantity').forEach(button => {
             button.replaceWith(button.cloneNode(true));
        });
         document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                 if (cart[index]) {
                    cart[index].quantity += 1;
                    updateCart();
                    saveCartToLocalStorage();
                 }
            });
        });

        document.querySelectorAll('.remove-item').forEach(button => {
             button.replaceWith(button.cloneNode(true));
        });
        document.querySelectorAll('.remove-item').forEach(button => {
            // Add click listener
            button.addEventListener('click', function () {
                handleRemoveItem(this);
            });
            // Add keypress listener for accessibility (Enter key)
             button.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                     handleRemoveItem(this);
                }
            });
        });
    }

    // --- Helper function to handle item removal ---
    function handleRemoveItem(buttonElement) {
        const index = parseInt(buttonElement.getAttribute('data-index'));
        if (cart[index]) {
             // Optional: Confirmation
            // if (confirm(`Bạn có chắc chắn muốn xóa ${cart[index].name} khỏi giỏ hàng?`)) {
                cart.splice(index, 1); // Remove item from array
                updateCart();
                saveCartToLocalStorage();
            // }
        }
    }


    // --- Checkout Button ---
    checkoutBtn.addEventListener('click', function () {
        if (cart.length === 0) {
            alert('Giỏ hàng của bạn đang trống!');
            return;
        }
        // Simulate checkout success
        alert('Đặt hàng thành công! Tổng tiền: ' + totalPriceElement.textContent);

        // Clear cart array
        cart.length = 0;
        updateCart(); // Update UI to show empty cart
        saveCartToLocalStorage(); // Save the empty cart state

        // Close sidebar
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });

    // --- Initial Cart Display ---
    // Call updateCart once on page load to display items from localStorage
    updateCart(); 

}); // End DOMContentLoaded
