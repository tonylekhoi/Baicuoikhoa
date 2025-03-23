const zaloButton = document.querySelector('.zalo');
const facebookButton = document.querySelector('.facebook');
const hotlineButton = document.querySelector('.hotline');

zaloButton.addEventListener('click', function() {
    alert('Chat với Zalo!');
});

facebookButton.addEventListener('click', function() {
    alert('Chat với Facebook!');
});

hotlineButton.addEventListener('click', function() {
    alert('Gọi hotline: 0986.989.626');
});
