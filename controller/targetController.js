/* eslint-disable consistent-return */
const targetModel = require('../model/targetModel');
const response = require('../utils/response');

module.exports = {
  getMonthly(req, res) {
    try {
      targetModel.getMonthlyTarget((err, result) => {
        if (err) {
          console.error(err);
          return response(200, 16000000, 'data target qmp perbulan tahun ini', res);
        }

        let data;

        if (result.length === 0) {
          data = [
            {
              januari: 1500000,
              februari: 1500000,
              maret: 1500000,
              april: 1500000,
              mei: 1500000,
              juni: 1500000,
              juli: 1500000,
              agustus: 1500000,
              september: 1500000,
              oktober: 1500000,
              november: 1500000,
              desember: 1500000,
            },
          ];
        } else {
          data = result;
        }

        const total = Object.values(data[0]).reduce((acc, value) => acc + value, 0);

        return response(200, total, 'data target qmp perbulan tahun ini', res);
      });
    } catch (error) {
      console.error(error);
      return response(200, 16000000, 'data target qmp perbulan tahun ini', res);
    }
  },

  getTargetDowntime(req, res) {
    try {
      targetModel.getTargetMaintenance((err, result) => {
        if (err) {
          console.error(err);
          return response(200, 2750, 'data target downtime', res);
        }
        return response(200, result[0], 'data target downtime', res);
      });
    } catch (error) {
      console.error(error);
      return response(200, 2750, 'data target downtime', res);
    }
  },

};
