const axios = require('axios');

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

const fetchData = async (symbol) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: "TIME_SERIES_DAILY",
        symbol: symbol,
        outputsize: 'full',
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    // Check if response data is valid
    if (!response.data || !response.data["Time Series (Daily)"]) {
      throw new Error('Invalid response format from Alpha Vantage');
    }

    // Process the time series data
    const timeSeries = response.data["Time Series (Daily)"];
    const processedData = [];

    for (const date in timeSeries) {
      const dailyData = timeSeries[date];

      // Check and sanitize fields
      const adjusted_close = isNaN(parseFloat(dailyData["5. adjusted close"])) ? 0 : parseFloat(dailyData["5. adjusted close"]);
      const volume = isNaN(parseInt(dailyData["6. volume"])) ? 0 : parseInt(dailyData["6. volume"]);

      processedData.push({
        date,
        adjusted_close,
        volume,
      });
    }

    return processedData;
  } catch (error) {
    throw new Error(`Error fetching data for ${symbol}: ${error.message}`);
  }
};

module.exports = { fetchData };
