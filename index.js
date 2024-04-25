const express = require("express");
const { createTables } = require("./helpers/userHelpers");
const bodyParser = require("body-parser");
const dataRoutes = require("./routes/userroutes");

// Create an Express application
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Call the createTables function when the application starts
(async () => {
  try {
    await createTables();
    // Start your application logic here
    console.log("Tables created successfully!");

    // Start listening for incoming requests
    const server = app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });

    // Handle errors during server startup
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.log("Server is already running on port 4000");
      } else {
        console.error("Error starting server:", error);
      }
    });
  } catch (error) {
    console.error("Error starting application:", error);
  }
})();

// Use dataRoutes middleware
app.use("/", dataRoutes);

module.exports = app;
