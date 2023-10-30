/* eslint-disable no-restricted-globals */
const qualityModel = require('../model/qualityModel');
const response = require('../utils/response');

module.exports = {
  getReportDepartement(req, res) {
    try {
      qualityModel.getReportDepart((err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'terjadi kesalahan pada database' });
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

        return response(200, data, 'Data report quality IPQC dan OQC', res);
      });
    } catch (error) {
      console.error(error);
    }
  },
};