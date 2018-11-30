// Activate navbar color change by scroll
$(window).scroll(function(){
    $('nav').toggleClass('scrolled', $(this).scrollTop() > 50);
});

// close on click for left navbar
$('.navbar-brand').on('click', function(){
    $('.navbar-collapse').collapse('hide');
});

// close on click for right navbar
$('.navbar-nav>li>a').on('click', function(){
    $('.navbar-collapse').collapse('hide');
});


