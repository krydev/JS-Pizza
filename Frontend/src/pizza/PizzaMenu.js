/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var API = require('../API');
var Pizza_List = [];

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
    if(filter === "all"){
        return API.getPizzaList(function (err, server_data) {
            var list_title = $(".page-title-row");
            var Pizza_List = [];
            if(err){
                console.log('An error occurred while trying to retrieve the pizza list.');
            } else {
                var vals = Object.values(server_data);
                vals.forEach(function (t) { Pizza_List.push(t) });
                // console.log(list[7]);
            }
            list_title.find(".title-text").text(category_titles.all);
            list_title.find(".amount-label span").text(Pizza_List.length);
            return showPizzaList(Pizza_List);
        });
    }
    API.getPizzaList(function (err, server_data) {
        var list_title = $(".page-title-row");
        var Pizza_List = [];
        if(err){
            console.log('An error occurred while trying to retrieve the pizza list.');
        } else {
            var vals = Object.values(server_data);
            vals.forEach(function (pizza) {
                if (pizza.content.hasOwnProperty(filter)){
                    Pizza_List.push(pizza);
                }
            });
            // console.log(list[7]);
        }
        list_title.find(".title-text").text(category_titles[filter]);
        list_title.find(".amount-label span").text(Pizza_List.length);
        return showPizzaList(Pizza_List);
    });
}

function initialiseMenu() {
    $("#all").click();
}


exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;