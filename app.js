require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser'); 

const ABDMRoutes = require("./routes/ABDMRoutes");

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
        callback(null, true); // Allow all origins
    },
    optionsSuccessStatus: 200,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.options('*', cors());

// Routes

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use('/api', ABDMRoutes); 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});