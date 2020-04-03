module.exports = {
    load: function () {
        if (process.env.NODE_ENV !== 'production') {
            require('dotenv').config();
            console.log(`Loaded ENV variables`);
        }
    }
};