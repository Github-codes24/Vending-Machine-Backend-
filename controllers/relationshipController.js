// controllers/relationshipController.js
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// ✅ Static relationships for now
exports.getRelationships = catchAsyncErrors(async (req, res, next) => {
  res.json({
    relationships: ["Self", "Wife", "Son", "Daughter", "Other"]
  });
});
