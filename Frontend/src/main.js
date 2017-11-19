/**
 * Created by chaika on 25.01.16.
 */

$(function(){
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var Pizza_List = require('./Pizza_List');

    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();
    initFilterBtns(PizzaMenu);
    $("#clear-cart").click(PizzaCart.clearCart);
    initOrderValidation();
});

function initOrderValidation(){
    var nameInput = $("#input-name");
    var phoneInput = $("#input-phone");
    var addressInput = $("#input-address");

    nameInput.on("change keyup", function() {
        validateName(nameInput);
    });

    phoneInput.on("change keyup", function () {
        validatePhone(phoneInput);
    });

    addressInput.on("change keyup", function () {
        var value = $(this).val();
       $(".order-address span").text((value.length === 0) ? "невідома" : value);
    });

    function validateName(nameInput) {
        var content = nameInput.val();
        var nameGroup = $(".name-group");
        var nameHelpBlock =  $(".name-help");
        if(content.length === 0 || /\d/.test(content)){
            toggleValidation(false, nameGroup, nameHelpBlock);
            return false;
        }
        toggleValidation(true, nameGroup, nameHelpBlock);
        return true;
    }

    function validatePhone(phoneInput) {
        var content = phoneInput.val();
        var phoneGroup = $(".phone-group");
        var phoneHelpBlock =  $(".phone-help");
        var i = 0;
        var len = content.length;
        if (len === 0) toggleValidation(false, phoneGroup, phoneHelpBlock);
        if (len === 13){
            if(content.charAt(0) !== '+' || content.charAt(1) !== '3' || content.charAt(2) !== '8'){
                toggleValidation(false, phoneGroup, phoneHelpBlock);
                return false;
            }
            i = 3;
        }
        if(content.charAt(i) !== '0'){
            toggleValidation(false, phoneGroup, phoneHelpBlock);
            return false;
        }

        if((len - (10 + i) !== 0)) {
            toggleValidation(false, phoneGroup, phoneHelpBlock);
            return false;
        }
        for(; i < len; i++){
            if(!$.isNumeric(content.charAt(i))){
                toggleValidation(false, phoneGroup, phoneHelpBlock);
                return false;
            }
        }
        toggleValidation(true, phoneGroup, phoneHelpBlock);
        return true;

    }

    function toggleValidation(isValid, formGroup, helpBlock) {
        if(isValid){
            formGroup.removeClass("has-error");
            formGroup.addClass("has-success");
            helpBlock.css("display", "none");
        } else{
            formGroup.removeClass("has-success");
            formGroup.addClass("has-error");
            helpBlock.css("display", "block");
        }
    }
}

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
    $("#all").click();
}