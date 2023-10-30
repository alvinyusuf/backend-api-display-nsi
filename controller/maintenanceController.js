/* eslint-disable consistent-return */
const maintenaneModel = require('../model/maintenanceModel');
const addingDowntime = require('../utils/addingDowntime');
const currentDowntimeFormater = require('../utils/currentDowntimeFormater');
const downtimeToSeconds = require('../utils/downtimeToSeconds');
const getLocaleDate = require('../utils/getLocaleDate');
const response = require('../utils/response');

module.exports = {
  getCurrentDowntime(req, res) {
    try {
      maintenaneModel.getCurrentDowntime((err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'terjadi kesalahan pada database' });
        }

        const downtime = currentDowntimeFormater(result);
        const limitDowntime = 10368000;
        const percentDowntime = (downtime.totalDowntimeInSeconds / limitDowntime) * 100
          .toFixed(2);

        const data = {
          ...downtime,
          percentDowntime,
          bulanDowntime: getLocaleDate(new Date()),
        };

        return response(200, data, 'data downtime bulan ini', res);
      });
    } catch (error) {
      console.error(error);
    }
  },

  getBeforeDowntime(req, res) {
    try {
      const { bulan } = req.params;

      maintenaneModel.getBeforeDowntime(bulan, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'ada kesalahan query' });
        }
        if (result.length > 0) {
          const downtime = result[0].totalDowntime;
          const totalDowntimeInSeconds = downtimeToSeconds(downtime);
          const date = getLocaleDate(result[0].bulan_downtime);

          const limitDowntime = 10368000;
          const percentDowntime = ((totalDowntimeInSeconds / limitDowntime) * 100).toFixed(2);

          const data = {
            totalDowntime: result[0].totalDowntime,
            totalDowntimeInSeconds,
            percentDowntime,
            bulanDowntime: date,
          };

          return response(200, data, `data downtime ${bulan} lalu`, res);
        }
        return res.status(500).json({ error: 'hanya mampu mengambil 2 bulan terakhir' });
      });
    } catch (error) {
      console.error(error);
    }
  },

  getCurrentMachines(req, res) {
    try {
      maintenaneModel.getCurrentMachines((err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'terjadi kesalahan pada database' });
        }

        const data = result.map((element) => ({
          id: element.id,
          noMesin: element.noMesin,
          pic: element.pic,
          statusAktifitas: element.status_aktifitas,
          statusMesin: element.status_mesin,
          tglKerusakan: getLocaleDate(element.tgl_kerusakan),
          totalDowntime: addingDowntime(element.current_downtime, element.total_downtime),
          totalDowntimeInHours: downtimeToSeconds(
            addingDowntime(element.current_downtime, element.total_downtime),
          ) / 3600,
        }));

        return response(200, data, 'data downtime tiap mesin', res);
      });
    } catch (error) {
      console.error(error);
    }
  },

  getHistoryDowntimes(req, res) {
    try {
      let currentDowntime;
      const limitDowntime = 10368000;
      maintenaneModel.getCurrentDowntime((err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'terjadi kesalahan pada database' });
        }

        const downtime = currentDowntimeFormater(result);
        const percentDowntime = (downtime.totalDowntimeInSeconds / limitDowntime) * 100
          .toFixed(2);

        currentDowntime = {
          ...downtime,
          percentDowntime,
          bulanDowntime: getLocaleDate(new Date(), true),
        };
      });

      maintenaneModel.getHistoryDowntime((err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'terjadi kesalahan pada database' });
        }

        const data = result.map((element) => ({
          totalDowntime: element.totalDowntime,
          totalDowntimeInSeconds: downtimeToSeconds(element.totalDowntime),
          percentDowntime: (downtimeToSeconds(element.totalDowntime) / limitDowntime) * 100,
          bulanDowntime: getLocaleDate(element.bulan_downtime, true),
        }));

        data.unshift(currentDowntime);

        return response(200, data, 'data history downtime 12 bulan terakhir', res);
      });
    } catch (error) {
      console.error(error);
    }
  },
};
