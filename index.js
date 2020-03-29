const mongoose = require('mongoose');
const express = require("express");
const Models = require('./Models');
const cors = require('cors');
require("./utils/loadEnv").load();

async function App() {
    const app = express();
    app.use(cors());
    await mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    app.listen(process.env.PORT, () => {
        console.log("Server running on port 3000");
    });
    app.get("/total(/:regionId)?", (req, res) => {
        const hasFilter = req.params.regionId !== void 0;
        const pipeline = [];
        pipeline.push({
            $unwind: "$regions"
        });
        if (hasFilter) {
            pipeline.push({
                $match: {"regions.id": {$eq: req.params.regionId}}
            });
        }
        pipeline.push({
            $group: {
                _id: "$date",
                deaths: {$sum: `$regions.deaths`},
                count: {$sum: `$regions.count`}
            }
        });
        Models.DailyStatistics.aggregate(pipeline).exec(function (err, dailyStatistics) {
            if (err) {
                console.error(err)
            }
            res.json(dailyStatistics);
        });
    });
    return app;
}

App();