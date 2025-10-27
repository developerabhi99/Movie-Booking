
const { lockSeats, releaseSeatLock } = require("../../utils/seatLock");
const { createOrder, processPayment } = require("../../utils/payment");
const Show = require("../../models/Client/Show");
const Booking = require("../../models/User/Booking");
const Order = require("../../models/Payment/order");

const postBookingService = async (userId, body) => {
  const { showId, seats } = body;

  // 1️.Validate show
  const show = await Show.findById(showId)
    .populate("movie theater screen")
    .lean();

    //console.log("show ",show);

  if (!show) throw new Error("Show not found");

  // 2️.Check if seats are already booked
  const alreadyBooked = seats.filter((s) => show.bookedSeats.includes(s));
  if (alreadyBooked.length > 0) {
    throw new Error(`Seats ${alreadyBooked.join(", ")} are already booked`);
  }

  // 3️.Lock seats temporarily in Redis (5 minutes)
  await lockSeats(showId, seats, 15*60);

  const totalAmount = show.ticketPrice * seats.length;

  // 4️. Create booking in HOLD state
  const booking = await Booking.create({
    user: userId,
    show: show._id,
    movie: show.movie,
    theater: show.theater,
    screen: show.screen,
    seats,
    totalAmount,
    paymentStatus: "PENDING",
    bookingStatus: "HOLD",
  });

  // 5️. Create mock payment order
  const orderData = await createOrder(totalAmount, booking._id);

  // 6️. Save order in DB
  const order = await Order.create({
    booking: booking._id,
    user: userId,
    paymentGateway: "MOCKPAY",
    orderId: orderData.id,
    amount: totalAmount,
    currency: orderData.currency,
    status: "CREATED",
  });

  // 7️. Link order to booking
  booking.order = order._id;
  await booking.save();

  // 8️.simulating payment success
  const payment = await processPayment(order.orderId);

  // 9️. Update order and booking upon successful mock payment
  if (payment.status === "SUCCESS") {
    order.status = "PAID";
    order.paymentId = payment.paymentId;
    await order.save();

    const updatedBooking = await Booking.findById(booking._id);
    updatedBooking.paymentStatus = "SUCCESS";
    updatedBooking.bookingStatus = "CONFIRMED";
    updatedBooking.paymentId = payment.paymentId;
    await updatedBooking.save();

    // 10. Update show with booked seats
    const showToUpdate = await Show.findById(show._id);
    showToUpdate.bookedSeats.push(...seats);
    await showToUpdate.save();

    // 11. Release seat lock (cleanup)
    await releaseSeatLock(show._id, seats);

    return {
      message: "Booking confirmed & payment successful.",
      booking: updatedBooking,
      order,
      payment,
    };
  }

  return {
    message: "Booking initiated but payment pending.",
    booking,
    order,
    razorpayOrder: orderData,
  };
};

module.exports = { postBookingService };
