
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// Book Schema
const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["read", "unread"],
            default: "unread",
        },
    },
    { timestamps: true }
);

const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);

// Format MongoDB document for frontend
function formatBook(book) {
    return {
        id: book._id.toString(),
        title: book.title,
        author: book.author,
        status: book.status,
    };
}

// MongoDB connection
async function connectDB() {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is missing from environment variables.");
    }

    if (mongoose.connection.readyState === 1) {
        return;
    }

    await mongoose.connect(process.env.MONGO_URI);
}

// Connect to database before API requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        res.status(500).json({
            message: "Database connection failed.",
        });
    }
});

// Test API
app.get("/", (req, res) => {
    res.json({
        message: "Book Management API is running successfully!",
    });
});

// Get all books
app.get("/books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.json(books.map(formatBook));
    } catch (error) {
        console.error("Fetch books error:", error.message);
        res.status(500).json({
            message: "Failed to fetch books.",
        });
    }
});

// Add a book
app.post("/books", async (req, res) => {
    try {
        const { title, author } = req.body;

        if (
            typeof title !== "string" ||
            typeof author !== "string" ||
            !title.trim() ||
            !author.trim()
        ) {
            return res.status(400).json({
                message: "Title and author are required.",
            });
        }

        const book = await Book.create({
            title: title.trim(),
            author: author.trim(),
        });

        res.status(201).json(formatBook(book));
    } catch (error) {
        console.error("Add book error:", error.message);
        res.status(500).json({
            message: "Failed to add book.",
        });
    }
});

// Toggle read/unread status
app.put("/books/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid book ID.",
            });
        }

        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found.",
            });
        }

        book.status = book.status === "read" ? "unread" : "read";
        await book.save();

        res.json(formatBook(book));
    } catch (error) {
        console.error("Update book error:", error.message);
        res.status(500).json({
            message: "Failed to update book.",
        });
    }
});

// Delete a book
app.delete("/books/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid book ID.",
            });
        }

        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found.",
            });
        }

        res.json({
            message: "Book deleted successfully.",
        });
    } catch (error) {
        console.error("Delete book error:", error.message);
        res.status(500).json({
            message: "Failed to delete book.",
        });
    }
});

// Local development server
const PORT = process.env.PORT || 5000;

if (require.main === module) {
    connectDB()
        .then(() => {
            console.log("MongoDB Atlas connected successfully!");

            app.listen(PORT, () => {
                console.log(`Server running at http://localhost:${PORT}`);
            });
        })
        .catch((error) => {
            console.error("Server startup failed:", error.message);
            process.exit(1);
        });
}

// Vercel serverless entry point
module.exports = app;
