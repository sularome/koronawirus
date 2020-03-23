const mongoose = require('mongoose');
const express = require("express");
const Models = require('./Models');
const cors = require('cors');
require("./utils/loadEnv").load();

async function App() {
    const app = express();
    setupCors(app);
    await mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    app.listen(process.env.PORT, () => {
        console.log("Server running on port 3000");
    });
    app.get("/total", (req, res, next) => {
        Models.DailyStatistics.aggregate([{
            $unwind: "$regions"
        }, {
            $group: {
                _id: "$date",
                deaths: {$sum: `$regions.deaths`},
                count: {$sum: `$regions.count`}
            }
        }
        ]).exec(function (err, dailyStatistics) {
            if (err) {
                console.error(err)
            }
            res.json(dailyStatistics);
        });
    });
    return app;
}

function setupCors(app) {
    const allowedOrigins = [`http://localhost:${process.env.PORT}`,
        `https://sularome.github.io/koronawirus`];
    app.use(cors({
        origin: function (origin, callback) {    // allow requests with no origin
            // (like mobile apps or curl requests)
            if (!origin) {
                return callback(null, true);
            }
            if (allowedOrigins.indexOf(origin) === -1) {
                var msg = 'The CORS policy for this site does not ' +
                    'allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        }
    }));
}

App();