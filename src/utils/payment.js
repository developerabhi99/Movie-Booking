/**
 * ✅ Mock payment utility
 * This version doesn't integrate with real gateways like Razorpay or Stripe.
 * It simply simulates creating an order and returning a fake payment ID.
 */

/**
 * Create a fake payment order
 * @param {Number} amount - Total amount in INR
 * @param {String} bookingId - Related booking ID
 * @returns {Object} Simulated order data
 */
const createOrder = async (amount, bookingId) => {
    // Simulate async delay
    await new Promise((resolve) => setTimeout(resolve, 200));
  
    const order = {
      id: `order_${Date.now()}`,
      amount,
      currency: "INR",
      bookingId,
      status: "CREATED",
    };
  
    return order;
  };
  
  /**
   * Simulate payment verification
   * @param {String} orderId - Mock order ID
   * @returns {Object} Simulated payment confirmation
   */
  const processPayment = async (orderId) => {
    // Simulate async delay
    await new Promise((resolve) => setTimeout(resolve, 200));
  
    const payment = {
      paymentId: `pay_${Math.random().toString(36).substring(2, 10)}`,
      orderId,
      status: "SUCCESS",
    };
  
    return payment;
  };
  
  module.exports = {
    createOrder,
    processPayment,
  };
  