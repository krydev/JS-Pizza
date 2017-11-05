/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

var category_titles = {
    all: "Усі піци",
    meat: "М'ясні піци",
    pineapple: "Піци з ананасами",
    mushroom: "Піци з грибами",
    ocean: "Піци з морепродуктами",
    veg: "Вегетеріанські піци"
};

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-btn-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-btn-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {

    var list_title = $(".page-title-row");
    if(filter === "all"){
        list_title.find(".title-text").text(category_titles.all);
        list_title.find(".amount-label span").text(Pizza_List.length);
        return showPizzaList(Pizza_List);
    }
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    Pizza_List.forEach(function(pizza){

        if (pizza.content.hasOwnProperty(filter)){
            pizza_shown.push(pizza);
        }

    });

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
    list_title.find(".title-text").text(category_titles[filter]);
    list_title.find(".amount-label span").text(pizza_shown.length);
}

function initialiseMenu() {
    //Показуємо усі піци
    filterPizza("all");
    showPizzaList(Pizza_List);
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;