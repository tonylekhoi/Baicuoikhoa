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
