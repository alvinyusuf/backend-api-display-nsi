/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
const salesModel = require('../model/salesModel');
const response = require('../utils/response');

function getMonthName(index) {
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
  ];
  return months[index - 1];
}

function getMonthIndex(monthName) {
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
  ];
  return months.indexOf(monthName) + 1;
}

async function getDetailActual() {
  try {
    const data = await salesModel.getDetailActual();
    const defaultValue = {
      bulan: 'bulan',
      totalUSDPrice: 0,
    };

    if (data.length < 12) {
      const existingMonths = data.map((item) => item.bulan);

      for (let i = 1; i <= 12; i++) {
        const monthName = getMonthName(i);
        if (!existingMonths.includes(monthName)) {
          data.push({ ...defaultValue, bulan: monthName });
        }
      }
    }
    data.sort((a, b) => getMonthIndex(a.bulan) - getMonthIndex(b.bulan));

    return data;
  } catch (error) {
    console.error(error);
  }
}

function getMonthlyTarget() {
  return new Promise((resolve, reject) => {
    salesModel.getMonthlyTarget((err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        const data = result[0];
        resolve(data);
      }
    });
  });
}

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

  async getActualOnYear(req, res) {
    try {
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
      const data = await salesModel.getActualOnYear();
      return response(200, data[0], 'data sales selama satu tahun berjalan', res);
    } catch (error) {
      console.error(error);
    }
  },

  async getMonthlyPercent(req, res) {
    try {
      const aktual = await getDetailActual();
      const target = await getMonthlyTarget();

      const indonesianToEnglishMonthMap = {
        januari: 'january',
        februari: 'february',
        maret: 'march',
        april: 'april',
        mei: 'may',
        juni: 'june',
        juli: 'july',
        agustus: 'august',
        september: 'september',
        oktober: 'october',
        november: 'november',
        desember: 'december',
      };

      const newTarget = Object.keys(target).reduce((acc, key) => {
        const newKey = indonesianToEnglishMonthMap[key] || key;
        acc[newKey] = target[key];
        return acc;
      }, {});

      const data = aktual.map((item) => ({
        bulan: item.bulan,
        totalUSDPrice: item.totalUSDPrice,
        target: newTarget[item.bulan.toLowerCase()] || 0,
        percen: ((item.totalUSDPrice / newTarget[item.bulan.toLowerCase()] || 0) * 100),
      }));

      return response(200, data, 'persentase sales bulanan', res);
    } catch (error) {
      console.error(error);
    }
  },

};
