const userHelper = require("../helpers/userHelpers");

exports.dataController = async (req, res) => {
  try {
    // Extract the required data from the request body
    const dat = {
      zone: req.body.zone,
      organizational: req.body.organizationid,
      totaldistance: req.body.total_distance,
      itemtype: req.body.item_type,
    };

    // Call the calculateTotalPrice function to perform the calculation
    let datas = await userHelper.calculateTotalPrice(dat);
     res.json({ total_price: datas });
  } catch (err) {
    // Log any errors that occur during the process
    console.error(err);

    // Send a 500 Internal Server Error response if an error occurs
    res.status(500).send("Internal Server Error");
  }
};
