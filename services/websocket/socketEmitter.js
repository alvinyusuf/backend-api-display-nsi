/* eslint-disable no-restricted-globals */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
const maintenanceModel = require('../../model/maintenanceModel');
const productionModel = require('../../model/productionModel');
const qualityModel = require('../../model/qualityModel');
const salesModel = require('../../model/salesModel');
const currentDowntimeFormater = require('../../utils/currentDowntimeFormater');
const getLimitDowntime = require('../../utils/getLimitDowntime');

module.exports = {
  async downtimeEmitter(socket) {
    try {
      maintenanceModel.getCurrentDowntime(async (err, result) => {
        if (err) {
          console.error(err);
          return err;
        }
        const downtime = currentDowntimeFormater(result);
        const limit = await getLimitDowntime();
        const limitDowntime = limit * 3600;
        const percentDowntime = ((downtime.totalDowntimeInSeconds / limitDowntime) * 100)
          .toFixed(2);
        socket.emit('currentDowntime', percentDowntime);
      });
    } catch (error) {
      console.error('Error in downtimeEmitter:', error);
      socket.emit('currentDowntime', 0.001);
    }
  },

  async qualityEmitter(socket) {
    try {
      qualityModel.getReportDepart((err, result) => {
        if (err) {
          console.error(err);
          return err;
        }

        socket.emit('percenClaims', result);
      });
    } catch (error) {
      console.error(error);
    }
  },

  async productionEmitter(socket) {
    try {
      const result = await productionModel.getCurrentPercentProduction();
      socket.emit('percentProduction', result);
    } catch (error) {
      const data = [
        {
          PostDate: '2023-11-06T00:00:00.000Z',
          LineType: 'CAM',
          RataRata: 0,
        },
        {
          PostDate: '2023-11-06T00:00:00.000Z',
          LineType: 'LINE1',
          RataRata: 0,
        },
        {
          PostDate: '2023-11-06T00:00:00.000Z',
          LineType: 'LINE2',
          RataRata: 0,
        },
        {
          PostDate: '2023-11-06T00:00:00.000Z',
          LineType: 'LINE3',
          RataRata: 0,
        },
      ];
      socket.emit('percentProduction', data);
      console.error('Error in productionEmitter:', error);
    }
  },

  async salesMonthlyEmitter(socket) {
    try {
      const listCustomer = await salesModel.getListCostumer();
      socket.emit('monthlySales', listCustomer);
    } catch (error) {
      console.error(error);
    }
  },

  async salesQmpEmitter(socket) {
    try {
      let data;
      const actualOnYear = await salesModel.getActualOnYear();
      if (actualOnYear && actualOnYear.length > 0) {
        data = actualOnYear[0].totalUSDSales;
      } else {
        data = { totalUSDSales: 0 };
      }
      socket.emit('qmpSales', data);
    } catch (error) {
      console.error(error);
    }
  },
};
