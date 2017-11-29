/**
 * Created by chaika on 25.01.16.
 */

$(function(){
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var OrderPage = require('./order');
    var backend = require('./API');

    PizzaCart.initialiseCart();
    initFilterBtns(PizzaMenu);
    PizzaMenu.initialiseMenu();
    $("#clear-cart").click(PizzaCart.clearCart);
    if (window.location.pathname === '/order.html') {
        OrderPage.initOrderValidation();
        OrderPage.initSubmitHandler(PizzaCart, backend);
        OrderPage.initializeMap();
    }
});


function initFilterBtns(PizzaMenu) {
    var filter_btns = $(".btn-filter");
    filter_btns.click(function () {
        var curr = $(this);
        var last = $(".last-clicked");
        if(last) {
            last.removeClass("clicked-btn last-clicked");
            last.addClass("unclicked-btn");
        }
        curr.addClass("clicked-btn last-clicked");
        curr.removeClass("unclicked-btn");
        PizzaMenu.filterPizza(curr.attr('id'));
    });
}