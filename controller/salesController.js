/* eslint-disable consistent-return */
const salesModel = require('../model/salesModel');
const response = require('../utils/response');

module.exports = {
  async getListCustomer(req, res) {
    try {
      const data = await salesModel.getListCostumer();
      const result = data.map((element) => (
        {
          ...element,
          namaCustomer: element.namaCustomer1 === 'PT. TAKITA MANUFACTURING INDONESIA' ? 'TAKITA' : `${element.namaCustomer}`,
        }
      ));

      return response(200, result, 'data list semua customer', res);
    } catch (error) {
      console.error(error);
    }
  },

  async getDetailCustomer(req, res) {
    try {
      const { customer } = req.params;
      const data = await salesModel.getDetailCustomer(customer);
      return response(200, data, 'data detail customer', res);
    } catch (error) {
      console.error(error);
    }
  },

  async getCheck(req, res) {
    try {
      const { customer } = req.params;
      const data = await salesModel.cekImprove(customer);
      return response(200, data, 'cek query', res);
    } catch (error) {
      console.error(error);
    }
  },

  async getActualOnYear(req, res) {
    try {
      const data = await salesModel.getActualOnYear();
      return response(200, data[0], 'cek query', res);
    } catch (error) {
      console.error(error);
    }
  },
};
