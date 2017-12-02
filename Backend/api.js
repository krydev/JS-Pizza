/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');
var cryptoUtils = require('./utilsCrypto');
var LIQPAY_PUBLIC_KEY = "i87607524112";
var LIQPAY_PRIVATE_KEY = require("./PK_LQ");

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

exports.createOrder = function(req, res) {
    var order_info = req.body;
    console.log("Creating Order", order_info);

    var pizzasInfo = "";
    order_info.orderedPizzas.forEach(function (pizzaInfo) {
        pizzasInfo += "- " + pizzaInfo.quantity + "шт. [" + pizzaInfo.sizeDisplay + "] "
            + pizzaInfo.pizza.title + ";\n";
    });

    var order = {
        version: 3,
        public_key:	LIQPAY_PUBLIC_KEY,
        action:	"pay",
        amount:	order_info.orderSum,
        currency: "UAH",
        description: "Замовлення піци: " + order_info.customerName + "\n" +
        "Адреса доставки: " + order_info.customerAddress + "\n" +
        "Телефон: " + order_info.customerPhone + "\n" +
        "Замовлення:\n" + pizzasInfo +
        "Разом " + order_info.orderSum + "грн",
        order_id: Math.random(),
        //!!!Важливо щоб було 1,	бо інакше візьме гроші!!!
        sandbox: 1
    };

    var data = cryptoUtils.base64(JSON.stringify(order));
    var signature = cryptoUtils.sha1(LIQPAY_PRIVATE_KEY	+ data + LIQPAY_PRIVATE_KEY);


    res.send({
        data: data,
        signature: signature,
        success: true
    });
};