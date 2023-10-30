/* eslint-disable import/no-unresolved */
/* eslint-disable consistent-return */
const productionModel = require('../model/productionModel');
const doubleFilter = require('../utils/doubleFilter');

const response = require('../utils/response');
const sortByDate = require('../utils/sortByDate');

module.exports = {
  async getProductions(req, res) {
    try {
      const { line } = req.params;
      let result = await productionModel.getPercentProduction(line);

      if (!result.length) {
        result = [{ percent: 0.000001 }];
      }

      return response(200, result[0], `data production line ${line} hari ini`, res);
    } catch (error) {
      console.error(error);
    }
  },

  async getAllLine(req, res) {
    try {
      const result = await productionModel.getPercentAllLine();

      if (result[0].length === 0) {
        result[0] = [{
          mcn: null,
          groupMcn: null,
          itemCode: null,
          planQty: null,
          receiveQty: null,
          percen: null,
          wh: null,
          next: null,
        }];
      }

      return response(200, result[0], 'data production semua line hari ini', res);
    } catch (error) {
      console.error(error);
    }
  },

  async getSpecificLine(req, res) {
    try {
      const { line } = req.params;
      const result = await productionModel.getPercentSpecificLine(line);

      if (result[0].length === 0) {
        result[0] = [{
          mcn: null,
          groupMcn: null,
          itemCode: null,
          planQty: null,
          receiveQty: null,
          percen: null,
          wh: null,
          next: null,
        }];
      }

      return response(200, result[0], `data production permesin di line ${line} hari ini`, res);
    } catch (error) {
      console.error(error);
    }
  },

  async historyProduction(req, res) {
    try {
      const result = await productionModel.getPercentHistory();
      const data = sortByDate(result);
      const send = doubleFilter(data);

      return response(200, send, 'data history production 12 bulan terakhir', res);
      // return response(200, result[0], 'data history production 12 bulan terakhir', res);
    } catch (error) {
      console.error(error);
    }
  },
};
