/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
const salesModel = require('../model/salesModel');
const response = require('../utils/response');

// Fungsi untuk mendapatkan nama bulan berdasarkan indeks (1-12)
function getMonthName(index) {
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
  ];
  return months[index - 1];
}

// Fungsi untuk mendapatkan indeks bulan berdasarkan nama bulan
function getMonthIndex(monthName) {
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
  ];
  return months.indexOf(monthName) + 1;
}

async function getDetailActual() {
  const data = await salesModel.getDetailActual();
  const defaultValue = {
    bulan: 'bulan',
    totalUSDPrice: '0000',
  };

  try {
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
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Terjadi kesalahan pada database');
      } else {
        const data = result[0];
        resolve(data);
      }
    });
  });
}

// async function getMonthlyTarget() {
//   try {
//     salesModel.getMonthlyTarget(async (err, result) => {
//       if (err) {
//         console.error(err);
//         return 'terjadi kesalahan pada database';
//       }
//       const data = await result[0];
//       // console.log(result);
//       return data;
//     });
//   } catch (error) {
//     console.error(error);
//   }
// }

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
      return response(200, data[0], 'data sales selama satu tahun berjalan', res);
    } catch (error) {
      console.error(error);
    }
  },

  async getMonthlyPercent(req, res) {
    try {
      let aktual = await getDetailActual();
      let target = await getMonthlyTarget();
      let result = {persen: {},};
      const englishData = {};

      const indonesianToEnglishMonthMap = {
        januari: 'January',
        februari: 'February',
        maret: 'March',
        april: 'April',
        mei: 'May',
        juni: 'June',
        juli: 'July',
        agustus: 'August',
        september: 'September',
        oktober: 'October',
        november: 'November',
        desember: 'December'
      }

      for(const [indonesianMonth, value] of Object.entries(target)) {
        const englishMonth = indonesianToEnglishMonthMap[indonesianMonth];
        englishData[englishMonth] = value;

        const data = { aktual, englishData };
      }
        
      const dataGabung = data.aktual.map((item) => ({
        bulan: item.bulan,
        totalUSDPrice: item.totalUSDPrice,
        target: data.target[item.bulan.toLowerCase()] || 0,
        persen: ((totalUSDPrice / englishData) * 100),
      }));
      console.log(dataGabung);

      return response(200, result, 'persentase sales bulanan', res);
    } catch (error) {
      console.error(error);
    }
  }
};

// console.log(data);
// data.forEach((item) => {
//   const { bulan, totalUSDPrice } = item;
//   const totalTarget = data.target[bulan.toLowerCase()];
//   const persen = (totalUSDPrice / totalTarget) * 100;
//   console.log(persen);
//   result.persen[bulan] = persen;
//   result = { bulan, persen };
//   console.log(result);
// });

// console.log(data);