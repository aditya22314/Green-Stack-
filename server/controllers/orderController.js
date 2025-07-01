import Order from "../models/Order.js";
import Product from "../models/Products.js";
import stripe from "stripe";
import User from "../models/User.js";

export const placeOrderCod = async (req, res) => {
  try {
    const { items, address } = req.body;
    const { userId } = req.userId;
    if (!address || items.length === 0) {
      return res.json({ succss: false, message: "Invalid data" });
    }
    let amount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      amount += product.offerPrice * item.quantity;
    }

    amount = Math.floor(amount + amount * 0.02);

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

export const placeOrderStripe = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.userId;
    const { origin } = req.headers;
    if (!address || items.length === 0) {
      return res.json({ succss: false, message: "Invalid data" });
    }

    let productData = [];

    // Calculate Amount using items
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add tax charge 2%
    amount = Math.floor(amount * 0.02);
    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = productData.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.floor((item.price + item.price * 0.02) * 100),
        },
        quantity: item.quantity,
      };
    });

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });
    return res.json({
      success: true,
      url: session.url,
      message: "Order placed successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const orderId = session.metadata.orderId;
      const userId = session.metadata.userId;

      await Order.findByIdAndUpdate(orderId, { isPaid: true, status: "Paid" });

      await User.findByIdAndUpdate(userId, { cartItems: {} });

      console.log(`✅ Order ${orderId} marked as paid successfully.`);
    } catch (error) {
      console.error("Error updating order status:", error.message);
    }
  }

  // ✅ Always respond to Stripe
  res.json({ received: true });
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders1 = await Order.find({});
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    console.log(orders, "88");
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    }).populate("items.product address");
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
