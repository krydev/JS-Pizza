var map;
var directionDisplay;
var markerHome;
var markerPizza;

function initializeMap() {
//Тут починаємо працювати з картою
    var mapProp = {
        center:	new	google.maps.LatLng(50.464379,30.519131),
        zoom: 13
    };
    var html_element = document.getElementById("googleMap");
    map	= new google.maps.Map(html_element, mapProp);
    directionDisplay = new google.maps.DirectionsRenderer({suppressMarkers : true});
    //Карта створена і показана

    var point = new google.maps.LatLng(50.464379,30.519131);
    markerPizza	= new google.maps.Marker({
        position: point,
        map: map,
        icon: "assets/images/map-icon.png"
    });

    google.maps.event.addListener(map, 'click', function(click){
        var coordinates	= click.latLng;
        geocodeLatLng(coordinates, function(err, address){
            if (!err) {
                //Дізналися адресу
                callBackGeocode(null, coordinates);
                $("#input-address").val(address);
                $("#order-address span").text(address);
                toggleValidation(true, $(".address-group"), $(".address-help"));
            } else {
                console.log("Немає адреси");
            }
        });
    });

}

function calculateRoute (A_latlng, B_latlng, callback) {
    var directionService = new google.maps.DirectionsService();
    directionDisplay.setMap(map);
    directionService.route({
        origin:	A_latlng,
        destination: B_latlng,
        travelMode:	google.maps.TravelMode["DRIVING"]
    }, function(response, status) {
        if ( status === google.maps.DirectionsStatus.OK ){
            var leg = response.routes[0].legs[0];
            directionDisplay.setDirections(response);
            callback(null, {
                duration: leg.duration
            });
        } else {
            callback(new Error("Cannot find	direction"));
        }
    });
}

function geocodeAddress(address, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[0])	{
            var coordinates	= results[0].geometry.location;
            callback(null, coordinates);
        } else {
            callback(new Error("Cannot find the address"));
        }
    });
}

function geocodeLatLng(latlng, callback){
    //Модуль за роботу з адресою
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[1]) {
            var address = results[1].formatted_address;
            callback(null, address);
        } else {
            callback(new Error("Can't find address"));
        }
    });
}

function callBackRoute(err, route) {
    if(!err){
        $("#order-time span").text(route.duration.text);
    } else {
        console.log(err);
    }
}

function callBackGeocode (err, coords) {
    if(!err){
        var point = new google.maps.LatLng(coords.lat(), coords.lng());
        if (markerHome !== undefined) {
            markerHome.setPosition(point);
        } else {
            markerHome = new google.maps.Marker({
                position: point,
                map: map,
                icon: "assets/images/home-icon.png"
            });
        }
        calculateRoute(markerPizza.position, markerHome.position, callBackRoute);
    } else {
        $("#order-time span").text("невідомий");
    }
}

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

    var typingTimer;
    var doneTypingInterval = 1000;

    addressInput.on("keyup", function () {

        var value = $(this).val();
        var addressSpan = $("#order-address span");
        addressSpan.text((value.length === 0) ? "невідома" : value);
        clearTimeout(typingTimer);
        if (value) {
            typingTimer = setTimeout(function () {
                geocodeAddress(value, callBackGeocode);
            }, doneTypingInterval);
        }
    });

}

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

function validateAddress(addressInput) {
    var content = addressInput.val();
    var addressGroup = $(".address-group");
    var addressHelpBlock =  $(".address-help");
    if (content.length === 0 || $("#order-time span").text() === "невідомий"){
        toggleValidation(false, addressGroup, addressHelpBlock);
        return false;
    }
    toggleValidation(true, addressGroup, addressHelpBlock);
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

function initSubmitHandler(PizzaCart, backend){
    $("#btn-submit").click(function () {
        var nameInput = $("#input-name");
        var phoneInput = $("#input-phone");
        var addressInput = $("#input-address");

        var validName = validateName(nameInput);
        var validPhone = validatePhone(phoneInput);
        var validAddress = validateAddress(addressInput);
        if(validName && validPhone && validAddress){
            var pizzas = PizzaCart.getPizzaInCart();
            var orderSum = PizzaCart.getTotalOrderSum();
            var customerName = nameInput.val();
            var customerPhone = phoneInput.val();
            var customerAddress = addressInput.val();
            var order_data = {
                customerName : customerName,
                customerPhone : customerPhone,
                customerAddress : customerAddress,
                orderedPizzas : pizzas,
                orderSum : orderSum
            };
            backend.createOrder(order_data, function (err, server_response) {
                if (err) {
                    console.log('An error occurred while trying to create a pizza Order.');
                } else {
                    LiqPayCheckout.init({
                        data: server_response.data,
                        signature: server_response.signature,
                        embedTo: "#liqpay",
                        language: "uk",
                        mode: "popup"	//	embed	||	popup
                    }).on("liqpay.callback", function(data){
                        console.log(data.status);
                        console.log(data);

                    }).on("liqpay.ready", function(data){
                        //	ready
                    }).on("liqpay.close", function(data){
                        // close
                    });
                }
            });
        }

    });
}

exports.map = map;
exports.initSubmitHandler = initSubmitHandler;
exports.initOrderValidation = initOrderValidation;
exports.initializeMap = initializeMap;

exports.validateName = validateName;
exports.validatePhone = validatePhone;
exports.validateAddress = validateAddress;
exports.toggleValidation = toggleValidation;