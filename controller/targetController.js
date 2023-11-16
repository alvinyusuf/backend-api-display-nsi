/* eslint-disable consistent-return */
const targetModel = require('../model/targetModel');
const response = require('../utils/response');

module.exports = {
  getTarget(req, res) {
    try {
      targetModel.getTarget((err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'terjadi kesalahan pada database' });
        }

        return response(200, result[0], 'data downtime bulan ini', res);
      });
    } catch (error) {
      console.error(error);
    }
  },

};
