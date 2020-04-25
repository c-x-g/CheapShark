const axios = require('axios');

class Search {
  constructor(query) {
    this.query = query;
  }

  async getStores() {
    try {
      const res = await axios(`https://www.cheapshark.com/api/1.0/stores`);
      this.result = res.data;
      //console.log(this.result);
    } catch (error) {
      alert(error);
    }
  }

  async getDeals() {
    try {
      const res = await axios('https://www.cheapshark.com/api/1.0/deals');
      this.result = res.data;

      for (let i = 0; i < this.result.length; i++) {
        console.log(res.data[i].dealRating);
      }
    } catch (error) {
      alert(error);
    }
  }
}

module.exports = Search;
