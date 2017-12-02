/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

var storage = require("basil.js");
storage = new storage();
//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

var SizeMap = {
    "big_size": "Велика",
    "small_size": "Мала"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];
var Cart_Info = {
    total_count : 0,
    total_price : 0
};


//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");


function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок

    var toAdd  = {
        pizza: pizza,
        size: size,
        sizeDisplay: SizeMap[size],
        quantity: 1
    };
    Cart_Info.total_price += pizza[size].price;

    for (var i = 0; i < Cart.length; i++){
        var item = Cart[i];
        if(item.pizza === pizza && item.size === size){
            item.quantity += 1;
            return updateCart();
        }
    }
    //Приклад реалізації, можна робити будь-яким іншим способом
    Cart.push(toAdd);
    Cart_Info.total_count += 1;

    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика

    var removeInd = Cart.indexOf(cart_item);
    if(removeInd > -1){
        Cart.splice(removeInd, 1);

        Cart_Info.total_price -= cart_item.pizza[cart_item.size].price * cart_item.quantity;
        Cart_Info.total_count -= 1;
        //Після видалення оновити відображення
        updateCart();
    }
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    //TODO: ...
    var saved_orders = storage.get("cart");
    if(saved_orders){
        Cart = saved_orders;
        Cart_Info = storage.get("cart_info");
        updateCart();
    }
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function getTotalOrderSum() {
    return Cart_Info.total_price;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    if(Cart.length === 0){
        toggleCartDisplay(true);
    } else {
        toggleCartDisplay(false);
    }
    $(".right-panel .amount-label span").text(Cart_Info.total_count);
    $(".order-sum .number span").text(Cart_Info.total_price);
    //Очищаємо старі піци в кошику
    $cart.html("");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            Cart_Info.total_price += cart_item.pizza[cart_item.size].price;

            //Оновлюємо відображення
            updateCart();
        });
        
        $node.find(".minus").click(function () {
           if(cart_item.quantity === 1){
               $node.remove();
               return removeFromCart(cart_item);
           }

           cart_item.quantity -= 1;
           Cart_Info.total_price -= cart_item.pizza[cart_item.size].price;

           updateCart();
        });

        $node.find(".remove").click(function(){
            $node.remove();
            removeFromCart(cart_item);
        });


        $cart.prepend($node);
    }

    Cart.forEach(showOnePizzaInCart);
    storage.set("cart", Cart);
    storage.set("cart_info", Cart_Info);

}

function clearCart(){
    var len = Cart.length;
    for (var i = 0; i < len; i++){
        removeFromCart(Cart[0]);
    }
}

function toggleCartDisplay(isEmpty) {
    var orderBtn = $(".order-button, #btn-order");
    var messageIfEmpty = $(".empty-cart-text");
    var orderSum = $(".order-sum");
    if(isEmpty){
        orderBtn.addClass("disabled");
        messageIfEmpty.css("display", "inline-block");
        orderSum.css("display", "none");
    } else {
        messageIfEmpty.css("display", "none");
        orderSum.css("display", "inline-block");
        orderBtn.removeClass("disabled");
    }
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;
exports.clearCart = clearCart;

exports.getPizzaInCart = getPizzaInCart;
exports.getTotalOrderSum = getTotalOrderSum;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;