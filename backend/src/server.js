import dotenv from "dotenv"
import app from "./app.js"
import connectDB from "./config/db.js"

// Load environment variables from .env file
dotenv.config()
const PORT = process.env.PORT || 5000

// Connect to MongoDB database
connectDB()

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
