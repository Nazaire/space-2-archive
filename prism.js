console.log("Prism purchase page");
var purchased = false;
var sku = "";

function init() {
  console.log("App Init");
  getProductList();
}

/*****************************************************************************
* Get the list of available products from the Chrome Web Store
*****************************************************************************/

function getProductList() {
  // console.log("google.payments.inapp.getSkuDetails");
  // google.payments.inapp.getSkuDetails({
  //   'parameters': {env: "prod"},
  //   'success': onSkuDetails,
  //   'failure': onSkuDetailsFailed
  // });
}

function onSkuDetails(response) {
  console.log("onSkuDetails", response);
  var products = response.response.details.inAppProducts;
  var count = products.length;
  for (var i = 0; i < count; i++) {
    var product = products[i];
    if (product.sku === "special.prism") {
      console.log("Found prism product");
      sku = product.sku;
      var price = parseInt(product.prices[0].valueMicros, 10) / 1000000;
      $("#purchaseButton").html("BUY NOW <br/> $" + price);
      $("#errorBar").html("");
    }
  }
  getLicenses();
}

function onSkuDetailsFailed(response) {
  console.log("onSkuDetailsFailed", response);
  $("#errorBar").html("Could not retrieve products list");
  $("#about").html(response.response.errorType);
}

/*****************************************************************************
* Get the list of purchased products from the Chrome Web Store
*****************************************************************************/

function getLicenses() { //Get purchased products
  console.log("google.payments.inapp.getPurchases");
  // google.payments.inapp.getPurchases({
  //   'parameters': { env: "prod" },
  //   'success': onLicenseUpdate,
  //   'failure': onLicenseUpdateFailed
  // });
}

function onLicenseUpdate(response) {
  console.log("onLicenseUpdate", response);
  var licenses = response.response.details;
  var count = licenses.length;
  for (var i = 0; i < count; i++) {
    var license = licenses[i];
    if (license.sku === "special.prism") {
      console.log("Prism product is owned");
      $("#purchaseButton").html("OWNED <br/> Thanks!");
    }
  }
}

function onLicenseUpdateFailed(response) {
  console.log("onLicenseUpdateFailed", response);
  $("#errorBar").html("Could not retrieve purchases");
  $("#about").html(response.response.errorType);
}


/*****************************************************************************
* Purchase an item
*****************************************************************************/

function buyProduct(sku) {
  console.log("google.payments.inapp.buy", sku);
  // google.payments.inapp.buy({
  //   parameters: { 'env': "prod" },
  //   'sku': sku,
  //   'success': onPurchase,
  //   'failure': onPurchaseFailed
  // });
}

function onPurchase(purchase) {
  console.log("onPurchase", purchase);
  var jwt = purchase.jwt;
  var cartId = purchase.request.cardId;
  var orderId = purchase.response.orderId;
  //tracker.sendEvent("UNLOCKS", "PRISM");
  getLicenses();
  chrome.runtime.sendMessage({ update: true });
}

function onPurchaseFailed(purchase) {
  console.log("onPurchaseFailed", purchase);
  $("#errorBar").html("Purchase Failed");
  $("#about").html(purchase.response.errorType);
}

init();
$("#purchaseButton").click(function () {
  if (!purchased && sku.length > 0) {
    buyProduct(sku);
  }
});