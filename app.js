const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const cors = require("cors");
require("dotenv").config();

// Import Route
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRouters = require("./routes/product");

// App
const app = express();

// Connect to Database
const db = process.env.DATABASE || "mongodb://127.0.0.1:27017/ecommerce";
mongoose
	.connect(process.env.DATABASE, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("DB connected");
	});

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

// Route
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRouters);

// Disable x-powered-by
app.disable("x-powered-by");

const port = process.env.PORT || 8000;

let server = app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});

server.timeout = 5000;
