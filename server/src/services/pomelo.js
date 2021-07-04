/**
 * PomeloService
 * @author krthr
 * @author sjdonado
 * @since 2.0.0
 */

const axios = require('axios');
const { pomelo } = require('../config');
const ApiError = require('../lib/ApiError');
const logger = require('../utils/logger');

class PomeloService {
  constructor({ username, password }) {
    this.http = axios.create({
      baseURL: pomelo.baseURL,
      auth: { username, password },
    });
  }

  async getUserId() {
    try {
      const { data } = await this.http.get('/security/getUserInfo');
      return data.userId;
    } catch (err) {
      logger.error(err);
      throw new ApiError('Failed to get userId', err.response.status);
    }
  }

  async getFullNameAndTerms(userId) {
    try {
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
    } catch (err) {
      logger.error(err);
      throw new ApiError('Failed to get user fullName and terms', err.response.status);
    }
  }

  async getSchedule(userId, termId) {
    try {
      const { data } = await this.http.get(`/courses/overview/${userId}?term=${termId}`);
      return data.terms[0].sections;
    } catch (err) {
      logger.error(err);
      throw new ApiError('Failed to get schedule', err.response.status);
    }
  }
}

module.exports = PomeloService;
