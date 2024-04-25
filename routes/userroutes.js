// Import the Express module
const express = require("express");

// Create a new router using Express's Router function
const router = express.Router();

// Import the user controller module
const usercontroller = require("../controller/usercontroller");

// Define a route for POST requests to the "/data" endpoint
// When a POST request is received, it will be handled by the dataController function from the user controller module
router.post("/data", usercontroller.dataController);

// Export the router so it can be used in other parts of the application
module.exports = router;
