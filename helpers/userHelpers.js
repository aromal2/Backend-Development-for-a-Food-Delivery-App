const dotenv = require("dotenv");
dotenv.config();

const path = require("path");
const fs = require("fs");
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
});

async function createTables() {
  // Read the schema.sql file
  const filePath = path.join(__dirname, "..", "schema", "schema.sql");
  const schemaSql = fs.readFileSync(filePath).toString();

  const client = await pool.connect();
  try {
    // Split the SQL script into individual statements
    const statements = schemaSql.split(";");

    // Execute each statement one by one
    for (const statement of statements)
      if (statement.trim()) {
        try {
          // Try to execute the statement
          await client.query(statement);
        } catch (error) {
          // If the error indicates that the table already exists, ignore it
          if (error.code !== "42P07") {
            throw error;
          }
        }
      }
    console.log("Tables created successfully!");
  } catch (err) {
    console.error("Error executing schema.sql:", err);
  } finally {
    client.release();
  }
}

async function calculateTotalPrice(reqBody) {
  try {
    // Connect to the database using the pool
    const client = await pool.connect();

    // Execute the query with parameters
    const result = await client.query(
      `
     SELECT
        CASE
          WHEN $3 < 6 THEN pricing.fix_price
          WHEN $3 >= 6 AND item.type = 'perishable' THEN pricing.fix_price + (($3 - 5) * 1.5)
          WHEN $3 >= 6 AND item.type = 'non-perishable' THEN pricing.fix_price + ($3 - 5)
        END AS total_price
      FROM
        pricing
      JOIN
        item ON pricing.item_id = item.id
      JOIN
        organization ON pricing.organization_id = organization.id
      WHERE
        pricing.zone = $1
        AND pricing.organization_id = $2
        AND item.type = $4
      `,
      [
        reqBody.zone,
        reqBody.organizational,
        reqBody.totaldistance,
        reqBody.itemtype,
      ]
    );

    // Check if any rows were returned
    if (result.rows.length === 0) {
      console.log("No rows returned from the query.");
      // Handle the case where no rows are returned, if needed
    } else {
      // Return the calculated total price if needed
      return result.rows[0].total_price;
    }

    // Release the client back to the pool
    client.release();
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
}

module.exports = { createTables, calculateTotalPrice };
