const { neon } = require("@neondatabase/serverless");  // Correctly import NeonDB
const sql = neon(process.env.DATABASE_URL); // Initialize NeonDB client

// Controller to create an appointment slot
const createAppointmentSlot = async (req, res) => {
  const { date, start_time, end_time } = req.body;

  // Log the request body to inspect the incoming data
  console.log(req.body); // Log the data sent from frontend

  // Validate the required fields
  if (!date || !start_time || !end_time) {
    return res.status(400).json({ message: "All fields are required." });
  }



  try {
    // Check if the new appointment slot overlaps with any existing slots
    const existingSlots = await sql`
      SELECT * FROM appointment_slots WHERE date = ${date}
    `;

    // Check if the new time range overlaps with any of the existing slots
    const isOverlapping = existingSlots.some(slot => {
      // Check if the new slot's start time or end time is inside an existing slot's range
      const slotStart = slot.start_time;
      const slotEnd = slot.end_time;

      return (
        (start_time >= slotStart && start_time < slotEnd) || // New slot's start time is within an existing slot
        (end_time > slotStart && end_time <= slotEnd) ||     // New slot's end time is within an existing slot
        (start_time <= slotStart && end_time >= slotEnd)     // New slot completely overlaps an existing slot
      );
    });

    if (isOverlapping) {
      return res.status(400).json({ message: "Appointment slot overlaps with an existing slot." });
    }

    // Insert the new appointment slot into the database with default 'not booked' status
    const result = await sql`
      INSERT INTO appointment_slots (date, start_time, end_time, status)
      VALUES (${date}, ${start_time}, ${end_time}, 'not booked')
      RETURNING id, date, start_time, end_time, status, created_at;
    `;

    // Return success response with the created appointment slot
    const slot = result[0];
    res.status(201).json({
      message: "Appointment slot created successfully",
      slot: {
        id: slot.id,
        date: slot.date,
        start_time: slot.start_time,
        end_time: slot.end_time,
        status: slot.status,
        created_at: slot.created_at, // Include created_at (if available in DB)
      },
    });
  } catch (error) {
    console.error("Error creating appointment slot:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createAppointmentSlot,
};
