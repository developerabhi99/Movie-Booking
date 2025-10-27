const { postBookingService } = require("../../services/User/bookingService");

/**
 * @desc Create a new booking (initiate booking + mock payment)
 * @route POST /client/bookings/add
 * @access Private (CLIENT)
 */
const postBookingHandler = async (req, res) => {
  try {
    const body = req.body;
    const userId = req.user._id;

    const result = await postBookingService(userId, body);

    return res.status(201).json({
      success: true,
      message: result.message || "Booking created successfully",
      data: {
        booking: result.booking,
        order: result.order,
        payment: result.payment, // if mock payment was simulated
      },
    });
  } catch (error) {
    console.error("Booking Error:", error.message);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create booking",
    });
  }
};

module.exports = { postBookingHandler };
