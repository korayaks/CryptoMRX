import axios from 'axios';
import moment from 'moment';

const formatSparkline = (numbers) => {
  const sevenDaysAgo = moment().subtract(7, 'days').unix();
  let formattedSparkline = numbers.map((item, index) => {
    return {//İlgili kripto para biriminin 7 günlük değişim grafiğini yapmak için gerekli x ve y değerlerini düzenliyorum..
      x: sevenDaysAgo + (index + 1) * 3600,
      y: item,
    }
  })

  return formattedSparkline;
}

const formatMarketData = (data) => {
  let formattedData = [];

  data.forEach(item => {
    const formattedSparkline = formatSparkline(item.sparkline_in_7d.price)//7 günlük değişim grafiğini oluşturuyor

    const formattedItem = {
      ...item,
      sparkline_in_7d: {
        price: formattedSparkline
      }
    }

    formattedData.push(formattedItem);//Sırasıyla tüm kripto para verilerini düzenleyip formattedData dizisine ekliyorum.
  });

  return formattedData;
}

export const getMarketData = async () => {//coingecko web apisi üzerinden verilerin çekildiği alan. Axios ile birlikte yapıyorum.
  try {
    const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=7d");
    const data = response.data;
    const formattedResponse = formatMarketData(data);
    return formattedResponse;
  } catch (error) {
    console.log(error.message);
  }
}