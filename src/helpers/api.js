import axios from 'axios';

export default class ApiClient {
  static async getChartData(groupBy) {
    const chartDataRequest = axios.get(`/api/all?groupBy=${groupBy}`);
    const data = await chartDataRequest.then((response) => response.data);

    return data;
  }

  static async getSinceYesterdayData() {
    const lastToday = await axios
      .get('/api/last')
      .then((response) => response.data)
      .catch((e) => {
        console.error(`Error getting most recent data for "Since Yesterday" article: ${e.message}`);
      });
    const lastYesterday = await axios
      .get('/api/last?from=yesterday')
      .then((response) => response.data)
      .catch((e) => {
        console.error(`Error getting yesterday data for "Since Yesterday" article: ${e.message}`);
      });

    return { lastToday, lastYesterday };
  }
}
