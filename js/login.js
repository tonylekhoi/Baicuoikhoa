$(document).ready(function(){
    $('#eye').click(function(){
        $(this).toggleClass('open');
        $(this).children('i').toggleClass('fa-eye-slash fa-eye');
        if($(this).hasClass('open')){
            $(this).prev().attr('type', 'text');
        }else{
            $(this).prev().attr('type', 'password');
        }
    });
});
document.addEventListener("DOMContentLoaded", function() {
    const createButton = document.querySelector("button");

    createButton.addEventListener("click", function() {
        alert("Account created successfully!");
    });
});
