const Cart = require("../../models/cart.model");
const productHelper = require("../../helpers/product");
const Product = require("../../models/product.model");
const Oder = require("../../models/oder.model");

//[GET] /checkout
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({ _id: cartId });

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({
        _id: productId,
        deleted: false,
      }).select("title thumbnail slug price discountPercentage");
      item.priceNew = productHelper.priceNewProduct(productInfo);
      item.productInfo = productInfo;
      item.totalPrice = item.priceNew * item.quantity;
    }
  }
  cart.totalPrice = cart.products.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );
  res.render("client/pages/checkout/index", {
    titlePage: "Đặt hàng",
    cartDetail: cart,
  });
};
//[POST] /checkout/oder
module.exports.checkoutPost = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body;
  const cart = await Cart.findOne({ _id: cartId });
  const productsOder = [];

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const objectProduct = {
        product_id: item.product_id,
        price: 0,
        discountPercentage: 0,
        quantity: item.quantity,
      };

      const productInfo = await Product.findOne({
        _id: item.product_id,
        deleted: false,
      }).select("price discountPercentage");

      objectProduct.price = productInfo.price;
      objectProduct.discountPercentage = productInfo.price;
      productsOder.push(objectProduct);
    }
  }

  let oder = {
    cart_id: cartId,
    userInfo: userInfo,
    products: productsOder,
  };

  const checkout = new Oder(oder);
  await checkout.save();

  await Cart.updateOne({ _id: cartId }, { products: [] });
  res.redirect(`/checkout/success/${checkout.id}`);
};
//[GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
  const orderId = req.params.orderId;
  const oder = await Oder.findOne({ _id: orderId });
  let total = 0;

  if (oder.products.length > 0) {
    for (const item of oder.products) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({
        _id: productId,
        deleted: false,
      }).select("title thumbnail slug price discountPercentage");
      item.priceNew = productHelper.priceNewProduct(productInfo);
      item.productInfo = productInfo;
      item.totalPrice = item.priceNew * item.quantity;
      total = total + item.totalPrice;
    }
  }
  oder.total = total;
  res.render("client/pages/checkout/success", {
    titlePage: "Thanh toán",
    order: oder,
  });
};
