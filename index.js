import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";

// Import routes
import userRoutes from "./routes/user.js";
import roleRoutes from "./routes/role.js";
import blogRoutes from "./routes/blog.js";
import commentRoutes from "./routes/comment.js";
import wallpaperRoutes from "./routes/wallpapers.js";
import draftRoutes from "./routes/draft.js";
import flagRoutes from "./routes/flag.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.get("/", (req, res) => {
    res.send("Blog and Content API");
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/wallpapers", wallpaperRoutes);
app.use("/api/drafts", draftRoutes);
app.use("/api/flags", flagRoutes);

// 404 Route
app.use((req, res) => {
    res.status(404).json({ message: "Resource not found" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
