/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-globals */
const qualityModel = require('../model/qualityModel');
const response = require('../utils/response');

module.exports = {
  getReportDepartement(req, res) {
    try {
      qualityModel.getReportDepart((err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'terjadi kesalahan pada database' });
        }

        return response(200, result, 'Data report quality IPQC dan OQC', res);
      });
    } catch (error) {
      console.error(error);
    }
  },
};
