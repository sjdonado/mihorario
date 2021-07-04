/**
 * PomeloService
 * @author krthr
 * @author sjdonado
 * @since 2.0.0
 */

const axios = require('axios');
const { pomelo } = require('../config');

class PomeloService {
  constructor(username, password) {
    this.http = axios.create({
      baseURL: pomelo.baseURL,
      auth: { username, password },
    });
  }

  async getUserId() {
    const { data } = await this.http.get('/security/getUserInfo');
    return data.userId;
  }

  async getFullNameAndTerms(userId) {
    const { data } = await this.http.get(`/courses/fullview/${userId}`);
    const fullName = data.person.name;
    const terms = data.terms.map(({
      id,
      name,
      startDate,
      endDate,
    }) => ({
      id,
      name,
      startDate,
      endDate,
    }));
    return { fullName, terms };
  }

  async getSchedule(userId, termId) {
    const { data } = await this.http.get(`/courses/overview/${userId}?term=${termId}`);
    return data;
  }
}

module.exports = PomeloService;
