// ======== Package Imports ========= //
import express from "express";
import mysql from "mysql2";
import "dotenv/config";
import cors from "cors";

// Enable express
const app = express();

// ========== Middleware ============= //
app.use(cors());
app.use(express.json());

// Create the connection to the database using pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD, // your password for root
  database: process.env.MYSQL_DATABASE, // database name
  waitForConnections: true,
  connectionLimit: 1,
  queueLimit: 0,
});

//============ API ENDPOINTS ==============//
// Root endpoint
app.get("/", (req, res) => {
  console.log("/ endpoint was hit 🎯");

  pool.query(`SELECT * FROM team_mate`, (err, result) => {
    if (err) {
      // HANDLE ERROR
      console.log("Database error:", err);
      return res.status(500).json({
        errorMessage:
          "An error occurred while fetching data from the database."
      });
    } else {
      // SEND BACK DATA
      res.json(result);
    }
  });
});

// Login endpoint
app.post("/api/login", (req, res) => {
  console.log("The /api/login endpoint was hit 🎯");
  console.log(req.body); // e.g { email: 'rob@dvds.com', password: 'rob123' }

  // STORING VALUES FROM THE FRONTEND
  const email = req.body.email; // e.g "rob@dvds.com"
  const password = req.body.password; // e.g. "123"

  // THE QUERY
  const query = `SELECT email, id, name FROM team_mate WHERE email = ? AND password = ?;`; // Use a prepared statement like this instead

  // QUERYING THE DATABASE
  pool.execute(query, [email, password], (err, result) => {
    // HANDLING ANY ERRORS - with the database
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ errorMessage: "Error fetching data", error: err });
    }

    // HANDLING THE RESULT
    // If it was successful we will get back an array with the data e.g. [{id: 1, name: "Billy", email: "rob@dvds.com", password: "123"}]
    // If it was unsuccessful we will get back an empty array, which has a length of 0 - this is how we can choose what status to send back

    // Unsuccessful login - we are returned an empty array
    if (result.length === 0) {
      return res.sendStatus(401); // e.g. no match found, incorrect login details
    }

    // Successful login - we are returned an array with an object
    if (result.length >= 1) {
      return res.sendStatus(200); // e.g. match found
    }

    console.log(result);
  });
});

//============= PORT =================//
const PORT = process.env.PORT || 4000;

app
  .listen(PORT, () => {
    console.log(`Server is alive on http://localhost:${PORT}`);
  })
  .on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.log("Port is already in use");
    } else {
      console.log("Server Error", error);
    }
  });
