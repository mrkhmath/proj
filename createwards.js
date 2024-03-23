const { MongoClient } = require("mongodb");

// MongoDB connection URL
require("dotenv/config");
const url = process.env.DATABASE_URL;
// Database Name
const dbName = "test";

// Sample data for ward details
const departments = [
  "Medicine",
  "Surgery",
  "Orthopedics",
  "Pediatrics",
  "ENT",
  "Ophthalmology",
  "Gynecology",
  "Dermatology",
  "Oncology",
];

const wardTypes = ["A", "B", "C", "D"];

const specialWards = [
  { ward_name: "Cardiology Care Unit (CCU)" },
  { ward_name: "Intensive Care Units (ICU)" },
];

// Function to generate random number of rooms and beds
function getRandomNumberOfRooms() {
  return Math.floor(Math.random() * 5) + 1;
}

// Function to generate random number of beds (between 5 and 15)
function getRandomNumberOfBeds() {
  return Math.floor(Math.random() * 11) + 5;
}

// Initialize MongoDB client
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connect to MongoDB and insert ward documents
async function insertWards() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);

    // Generate ward documents

    // Initialize an empty array to store ward documents
    let wardDocuments = [];

    // Generate ward documents for each department
    departments.forEach((department) => {
      // Generate regular wards for the department
      wardTypes.forEach((type) => {
        const numberOfRooms = getRandomNumberOfRooms();
        const rooms = [];
        for (let i = 1; i <= numberOfRooms; i++) {
          const numberOfBeds = getRandomNumberOfBeds();
          const beds = [];
          for (let j = 1; j <= numberOfBeds; j++) {
            beds.push({
              bed_number: j,
              status: "free",
              condition: "Good",
            });
          }
          rooms.push({
            room_number: i,
            room_type: "Standard",
            number_of_beds: numberOfBeds,
            beds: beds,
          });
        }
        wardDocuments.push({
          ward_name: `${department} ${type}`,
          department: department,
          capacity: 20, // Set your desired capacity
          current_patients: 0, // Assuming no patients initially
          rooms: rooms,
        });
      });
    });

    // Add special wards
    specialWards.forEach((specialWard) => {
      const numberOfRooms = getRandomNumberOfRooms();
      const rooms = [];
      for (let i = 1; i <= numberOfRooms; i++) {
        const numberOfBeds = getRandomNumberOfBeds();
        const beds = [];
        for (let j = 1; j <= numberOfBeds; j++) {
          beds.push({
            bed_number: j,
            status: "free",
            condition: "Good",
          });
        }
        rooms.push({
          room_number: i,
          room_type: "Standard",
          number_of_beds: numberOfBeds,
          beds: beds,
        });
      }
      wardDocuments.push({
        ward_name: specialWard.ward_name,
        department: "Special Wards",
        capacity: 10, // Set your desired capacity
        current_patients: 0, // Assuming no patients initially
        rooms: rooms,
      });
    });

    // Insert ward documents into the database
    const result = await db.collection("wards").insertMany(wardDocuments);
    console.log(`${result.insertedCount} wards inserted successfully`);
  } catch (err) {
    console.error("Error inserting wards:", err);
  } finally {
    // Close the MongoDB connection
    await client.close();
    console.log("MongoDB connection closed");
  }
}

// Run the insertWards function
insertWards();
