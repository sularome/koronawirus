const siteUrl = "https://www.gov.pl/web/koronawirus/wykaz-zarazen-koronawirusem-sars-cov-2";
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require('fs');
const mongoose = require('mongoose');
const Models = require('../backend/Models');
require("../utils/loadEnv").load();

const fetchData = async () => {
    const result = await axios.get(siteUrl);
    return cheerio.load(result.data);
};

fetchData().then(async $ => {
    const postJobButton = $('#registerData').text();
    const registerData = JSON.parse(postJobButton);
    const parsedData = JSON.parse(registerData.parsedData);
    await mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const currentDate = getCurrentUTCDate();
    const regions = parsedData
        .filter(regionData => regionData.Id !== `t00`)
        .map(regionData => {
            return new Models.Region({
                id: regionData.Id,
                deaths: regionData["Liczba zgonów"] || 0,
                count: regionData["Liczba"] || 0
            });
        });
    const dailyStatistics = new Models.DailyStatistics({
        date: currentDate,
        regions: regions
    });

    dailyStatistics.save(function (err, savedDailyStatics) {
        if (err) return console.error(err);
        console.log(`Daily statistics for ${savedDailyStatics.date.toString()} saved.`);
        process.exit();
    });

});

function getCurrentUTCDate() {
    const currentDate = new Date();
    return new Date(Date.UTC(currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate(),
        currentDate.getUTCHours(),
        currentDate.getUTCMinutes(),
        currentDate.getUTCSeconds(),
        currentDate.getUTCMilliseconds()
    ));
}