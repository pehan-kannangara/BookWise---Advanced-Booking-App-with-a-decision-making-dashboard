import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);

  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    next(err);
  }
};

export const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
};

export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted");
  } catch (err) {
    next(err);
  }
};

export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};

export const getHotels = async (req, res, next) => {
  const { min, max, limit, ...others } = req.query;

  // Parse limit, min, and max values and set defaults if necessary
  const parsedLimit = parseInt(limit, 10) || 10; // Default limit to 10
  const parsedMin = parseInt(min, 10) || 1; // Default min to 1
  const parsedMax = parseInt(max, 10) || 999; // Default max to 999

  try {
    // Create a new query object without unnecessary fields
    const query = { ...others };
    delete query.limit; // Ensure 'limit' is removed from query fields

    // Query for hotels with specified conditions
    const hotels = await Hotel.find({
      ...query,
      cheapestPrice: { $gt: parsedMin, $lt: parsedMax }, // Ensure correct price range
    }).limit(parsedLimit); // Apply limit to the query

    res.status(200).json(hotels); // Return the resulting hotels
  } catch (err) {
    console.error("Error fetching hotels:", err); // Log errors for debugging
    res
      .status(500)
      .json({ message: "An error occurred while fetching hotels." }); // Return error status and message
    next(err); // Pass error to next middleware
  }
};

export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");

  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

export const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotels", count: hotelCount },
      { type: "apartments", count: apartmentCount },
      { type: "resorts", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id); // Use 'await' to ensure correct retrieval

    if (!hotel) {
      // Handle case where hotel is not found
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });
    }

    const rooms = hotel.rooms || []; // Fallback to empty array if 'rooms' is undefined

    const list = await Promise.all(
      rooms.map((roomId) => Room.findById(roomId)) // Ensure 'rooms' is not undefined
    );

    res.status(200).json(list); // Return the list of rooms
  } catch (err) {
    console.error("Error in getHotelRooms:", err); // Log for debugging
    res.status(500).json({ success: false, message: "Server error" });
    next(err);
  }
};
