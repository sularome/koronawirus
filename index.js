const mongoose = require('mongoose');
const express = require("express");
const Models = require('./Models');
require("./utils/loadEnv").load();
async function App()
{
    const app = express();
    await mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
    app.get("/total", (req, res, next) => {
        Models.DailyStatistics.aggregate([{
            $unwind : "$regions"
        },{
            $group: {
                    _id: "$date",
                    deaths: { $sum: `$regions.deaths` },
                    count: { $sum: `$regions.count` }
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

App();