import Order from "../models/Order.js";
import Product from "../models/Products.js";

export const placeOrderCod = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    if (!address || items.length === 0) {
      return res.json({ succss: false, message: "Invalid data" });
    }
    let amount = items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add tax charge 2%
    amount = Math.floor(amount * 0.02);
    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });
    return res.json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
