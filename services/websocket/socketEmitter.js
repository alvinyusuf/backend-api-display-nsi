/* eslint-disable no-restricted-globals */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
const maintenanceModel = require('../../model/maintenanceModel');
const productionModel = require('../../model/productionModel');
const qualityModel = require('../../model/qualityModel');
const salesModel = require('../../model/salesModel');
const currentDowntimeFormater = require('../../utils/currentDowntimeFormater');

module.exports = {
  async downtimeEmitter(socket) {
    try {
      maintenanceModel.getCurrentDowntime((err, result) => {
        if (err) {
          console.error(err);
          return err;
        }
        const downtime = currentDowntimeFormater(result);
        const limitDowntime = 9900000;
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

        const percentCamIpqc = isNaN(result[0].aktual_cam_ipqc / result[0].target_cam_ipqc) ? 0
          : (result[0].aktual_cam_ipqc / result[0].target_cam_ipqc) * 100;
        const percentCncIpqc = isNaN(result[0].aktual_cnc_ipqc / result[0].target_cnc_ipqc) ? 0
          : (result[0].aktual_cnc_ipqc / result[0].target_cnc_ipqc) * 100;
        const percentMfgIpqc = isNaN(result[0].aktual_mfg_ipqc / result[0].target_mfg_ipqc) ? 0
          : (result[0].aktual_mfg_ipqc / result[0].target_mfg_ipqc) * 100;
        const percentCamOqc = isNaN(result[0].aktual_cam_oqc / result[0].target_cam_oqc) ? 0
          : (result[0].aktual_cam_oqc / result[0].target_cam_oqc) * 100;
        const percentCncOqc = isNaN(result[0].aktual_cnc_oqc / result[0].target_cnc_oqc) ? 0
          : (result[0].aktual_cnc_oqc / result[0].target_cnc_oqc) * 100;
        const percentMfgOqc = isNaN(result[0].aktual_mfg_oqc / result[0].target_mfg_oqc) ? 0
          : (result[0].aktual_mfg_oqc / result[0].target_mfg_oqc) * 100;

        const data = {
          percentCamIpqc,
          percentCncIpqc,
          percentMfgIpqc,
          percentCamOqc,
          percentCncOqc,
          percentMfgOqc,
        };

        socket.emit('percenClaims', data);
      });
    } catch (error) {
      console.error(error);
    }
  },

  async productionEmitter(socket) {
    try {
      let result = await productionModel.getCurrentPercentProduction();
      let lengthOfObject;
      if (result !== null) {
        lengthOfObject = Object.keys(result).length;
      }

      if (!lengthOfObject || result === null) {
        result = [{
          LineType: 'CAM',
          RataRata: 0.001,
        },
        {
          LineType: 'LINE1',
          RataRata: 0.001,
        },
        {
          LineType: 'LINE2',
          RataRata: 0.001,
        },
        {
          LineType: 'LINE3',
          RataRata: 0.001,
        }];
      }

      const data = {};

      result.forEach((item) => {
        const lineType = item.LineType.toLowerCase();
        data[lineType] = { percen: item.RataRata };
      });
      socket.emit('percentProduction', data);
    } catch (error) {
      const data = {
        cam: {
          percen: 0.001,
        },
        line1: {
          percen: 0.001,
        },
        line2: {
          percen: 0.001,
        },
        line3: {
          percen: 0.001,
        },
      };
      socket.emit('percentProduction', data);
      console.error('Error in productionEmitter:', error);
    }
  },

  async salesMonthlyEmitter(socket) {
    try {
      const listCustomer = await salesModel.getListCostumer();
      let targetUSD = 0;
      let aktualUSD = 0;

      listCustomer.map((e) => {
        targetUSD += e.totalTargetUSD;
        aktualUSD += e.totalAktualUSD;
      });

      const data = (aktualUSD / targetUSD) * 100;
      socket.emit('monthlySales', data);
    } catch (error) {
      console.error(error);
    }
  },

  async salesQmpEmitter(socket) {
    try {
      const actualOnYear = await salesModel.getActualOnYear();
      const data = actualOnYear[0].totalUSDSales;
      socket.emit('qmpSales', data);
    } catch (error) {
      console.error(error);
    }
  },
};
