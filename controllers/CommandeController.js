const Order = require('../models/Commande');
const Cart = require('../models/Cart');

// Place an order from a cart
exports.placeOrder = async (req, res) => {
  try {
    const { userId, payment , deliveryAddress } = req.body;

    const cart = await Cart.findOne({ userId }).populate('salesIds');
    if (!cart || cart.salesIds.length === 0) {
      return res.status(400).json({ message: 'Cart is empty or not found' });
    }

    const newOrder = new Order({
      userId,
      salesID: cart.salesIds,
      totalAmount: cart.cartTotal,
      status: 'pending',
      deliveryAddress,
      payment,

      
    });

    const savedOrder = await newOrder.save();

    // Clear the cart after placing the order
    cart.salesIds = [];
    cart.cartTotal = 0;
    await cart.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).populate('salesID');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('salesID');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
