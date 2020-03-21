const siteUrl = "https://www.gov.pl/web/koronawirus/wykaz-zarazen-koronawirusem-sars-cov-2";
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require('fs');

const fetchData = async () => {
    const result = await axios.get(siteUrl);
    return cheerio.load(result.data);
};

fetchData().then($ => {
    const postJobButton = $('#registerData').text();
    const registerData = JSON.parse(postJobButton);
    const parsedData = JSON.parse(registerData.parsedData);
    fs.writeFileSync(`./full_data_${getDateForFileName()}.json`, JSON.stringify(registerData), null, 2);
    fs.writeFileSync(`./parsedData_${getDateForFileName()}.json`, JSON.stringify(parsedData), null, 2);
});

function getDateForFileName() {
    const currentDate = new Date();
    return currentDate.getUTCFullYear()
        + "-" + currentDate.getUTCMonth()
        + "-" + currentDate.getUTCDate()
        + "-" + currentDate.getUTCHours()
        + "-" + currentDate.getUTCMinutes()
        + "-" + currentDate.getUTCSeconds()
}