/* eslint-disable consistent-return */
const productionModel = require('../model/productionModel');
const doubleFilter = require('../utils/doubleFilter');

const response = require('../utils/response');
const sortByDate = require('../utils/sortByDate');

module.exports = {
  async getProductions(req, res) {
    try {
      let result = await productionModel.getCurrentPercentProduction();
      let lengthOfObject;
      if (result !== null) {
        lengthOfObject = Object.keys(result).length;
      }

      if (!lengthOfObject || result === null) {
        result = [{
          PostDate: new Date(),
          LineType: 'CAM',
          RataRata: 0.001,
        },
        {
          PostDate: new Date(),
          LineType: 'LINE1',
          RataRata: 0.001,
        },
        {
          PostDate: new Date(),
          LineType: 'LINE2',
          RataRata: 0.001,
        },
        {
          PostDate: new Date(),
          LineType: 'LINE3',
          RataRata: 0.001,
        }];
      }

      return response(200, result, 'data production semua line hari ini', res);
    } catch (error) {
      console.error(error);
      return response(500, [], 'ada kesalahan di controller', res);
    }
  },

  async getAllLine(req, res) {
    try {
      const result = await productionModel.getPercentAllLine();
      const lengthOfObject = Object.keys(result[0]).length;

      if (!lengthOfObject) {
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
      return response(500, [], 'ada kesalahan di controller', res);
    }
  },

  async getSpecificLine(req, res) {
    try {
      const { line } = req.params;
      const result = await productionModel.getPercentSpecificLine(line);
      const lengthOfObject = Object.keys(result[0]).length;

      if (!lengthOfObject) {
        result[0] = [{
          id: null,
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

      const dataWithIds = result[0].map((item, index) => ({
        id: `${index + 1}`,
        ...item,
      }));

      return response(200, dataWithIds, `data production permesin di line ${line} hari ini`, res);
      // return response(200, result[0], `data production permesin di line ${line} hari ini`, res);
    } catch (error) {
      console.error(error);
      return response(500, [], 'ada kesalahan di controller', res);
    }
  },

  async historyProduction(req, res) {
    try {
      const result = await productionModel.getPercentHistory();
      const data = sortByDate(result);
      const send = doubleFilter(data);

      return response(200, send, 'data history production satu bulan terakhir', res);
    } catch (error) {
      console.error(error);
      return response(500, [], 'ada kesalahan di controller', res);
    }
  },
};
