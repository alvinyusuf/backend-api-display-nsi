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
      const { conn } = req;

      maintenaneModel.getCurrentDowntime(conn, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'terjadi kesalahan pada database' });
        }

        const downtime = currentDowntimeFormater(result);

        const data = {
          ...downtime,
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
      const { conn } = req;
      const { bulan } = req.params;

      maintenaneModel.getBeforeDowntime(conn, bulan, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'ada kesalahan query' });
        }
        if (result.length > 0) {
          const downtime = result[0].totalDowntime;
          const totalDowntimeInSeconds = downtimeToSeconds(downtime);
          const date = getLocaleDate(result[0].bulan_downtime);

          const data = {
            totalDowntime: result[0].totalDowntime,
            totalDowntimeInSeconds,
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
      const { conn } = req;

      maintenaneModel.getCurrentMachines(conn, (err, result) => {
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
          totalDowntimeInSeconds: downtimeToSeconds(
            addingDowntime(element.current_downtime, element.total_downtime),
          ),
        }));

        return response(200, data, 'data downtime tiap mesin', res);
      });
    } catch (error) {
      console.error(error);
    }
  },

  getHistoryDowntimes(req, res) {
    try {
      const { conn } = req;

      let currentDowntime;
      maintenaneModel.getCurrentDowntime(conn, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'terjadi kesalahan pada database' });
        }

        const downtime = currentDowntimeFormater(result);

        currentDowntime = {
          ...downtime,
          bulanDowntime: getLocaleDate(new Date()),
        };
      });

      maintenaneModel.getHistoryDowntime(conn, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'terjadi kesalahan pada database' });
        }

        const data = result.map((element) => ({
          totalDowntime: element.totalDowntime,
          totalDowntimeInSeconds: downtimeToSeconds(element.totalDowntime),
          bulanDowntime: getLocaleDate(element.bulan_downtime),
        }));

        data.unshift(currentDowntime);

        return response(200, data, 'data history downtime 12 bulan terakhir', res);
      });
    } catch (error) {
      console.error(error);
    }
  },
};
