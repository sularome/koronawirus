const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegionSchema = new Schema({
    id: String,
    deaths: Number,
    count: Number
});

const DailyStatisticsSchema = new Schema({
    date: Date,
    regions: [RegionSchema]
});

module.exports = {
    Region: mongoose.model('Region', RegionSchema),
    DailyStatistics:  mongoose.model('DailyStatistics', DailyStatisticsSchema)
};