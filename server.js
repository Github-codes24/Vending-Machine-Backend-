const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(express.json());

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/prescriptions", require("./routes/prescriptionRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
