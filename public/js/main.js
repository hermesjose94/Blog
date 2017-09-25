$(document).ready(main);

var contador =1;

function main() {
  $('.menu_bar').click(function(){
    if (contador ==1) {
      $('nav').animate({
        left: '0'
      });
      contador =0;
    }else {
      contador =1;
      $('nav').animate({
        left: '-100%'
      });
    }
  });

  $('.to_up').click(function(){
    $('body,html').animate({
      scrollTop: '0px'
    });
  });

  //Mostramos y ocultamos submenus

  $('.menu-item-has-children').click(function functionName() {
      $(this).children('.sub-menu').slideToggle();
  });



}
