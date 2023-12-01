/* eslint-disable consistent-return */
const mssql = require('../services/database/mssql');
const getDateNow = require('../utils/getDateNow');
const getStartAndBeforeDate = require('../utils/getStartAndBeforeDate');

module.exports = {
  async getCurrentPercentProduction() {
    try {
      const conn = await mssql;
      const now = getDateNow();
      const result = await conn.query(`SELECT T0.PostDate,
      CASE WHEN T0.U_MIS_NoMesin BETWEEN 'C01' AND 'C50' THEN 'CAM'
      WHEN T0.U_MIS_NoMesin BETWEEN 'B01' AND 'B51' THEN 'LINE1'
      WHEN T0.U_MIS_NoMesin BETWEEN 'B52' AND 'B72'
      OR T0.U_MIS_NoMesin BETWEEN 'D01' AND 'D35'
      OR T0.U_MIS_NoMesin = 'S003' THEN 'LINE2'
      WHEN T0.U_MIS_NoMesin BETWEEN 'A01' AND 'A53' THEN 'LINE3'
      END AS LineType, (SUM(T0.CmpltQty)/ SUM(T0.PlannedQty) * 100) AS RataRata
      FROM OWOR T0 INNER JOIN WOR1 T1 ON T0.[DocEntry] = T1.[DocEntry]
      WHERE ((T0.U_MIS_NoMesin BETWEEN 'C01' AND 'C50')
      OR (T0.U_MIS_NoMesin BETWEEN 'B01' AND 'B51')
      OR (T0.U_MIS_NoMesin BETWEEN 'B52' AND 'B72'
      OR T0.U_MIS_NoMesin BETWEEN 'D01' AND 'D35'
      OR T0.U_MIS_NoMesin = 'S003')
      OR (T0.U_MIS_NoMesin BETWEEN 'A01' AND 'A53'))
      AND T0.PostDate >= '${now}' AND T0.PostDate <= '${now}'
      AND T0.[UserSign] in (19,22,21) and T0.[Warehouse] = 'WHWIPMF1' and T0.[Status] not in ('C')
      GROUP BY T0.PostDate, CASE WHEN T0.U_MIS_NoMesin BETWEEN 'C01' AND 'C50' THEN 'CAM'
      WHEN T0.U_MIS_NoMesin BETWEEN 'B01' AND 'B51' THEN 'LINE1'
      WHEN T0.U_MIS_NoMesin BETWEEN 'B52' AND 'B72'
      OR T0.U_MIS_NoMesin BETWEEN 'D01' AND 'D35'
      OR T0.U_MIS_NoMesin = 'S003' THEN 'LINE2'
      WHEN T0.U_MIS_NoMesin BETWEEN 'A01' AND 'A53' THEN 'LINE3'
      END ORDER BY T0.PostDate DESC`);

      return result.recordset;
    } catch (error) {
      console.error(error);
      return [
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
    }
  },

  async getPercentSpecificLine(line) {
    try {
      const conn = await mssql;
      const now = getDateNow();
      const result = await conn.query(`SELECT
        T0.[U_MIS_NoMesin] as 'mcn',
        Y.U_MIS_CodeGroup 'groupMsn',
        T0.[ItemCode] as 'itemCode',
        T0.[PlannedQty] as 'planQty',
        T0.[CmpltQty] as 'receiveQty',
        T0.[CmpltQty]/T0.[PlannedQty] * 100 as 'percen',
        T0.[Warehouse] as 'wh',
        T0.[U_MIS_NextProc] as 'next'
        FROM OWOR T0 LEFT JOIN WOR1 T1 ON T0.[DocEntry] = T1.[DocEntry]
        LEFT JOIN [@MASTERMESIN] Y on T0.U_MIS_NoMesin = Y.Code
        cross JOIN (Select SUM(A.CmpltQty) CmpltQty , sum(A.PlannedQty) PlannedQty
        from OWOR A LEFT JOIN [@MASTERMESIN] Y on A.U_MIS_NoMesin = Y.Code
        where A.[UserSign] =19 and A.[Warehouse] = 'WHWIPMF1' and A.[Status] not in ('C')
        and A.[PostDate] >= '${now}' and A.[PostDate] <= '${now}') X
        WHERE T0.[UserSign] in (19,22,21) and T0.[Warehouse] = 'WHWIPMF1' and T0.[Status] not in ('C')
        and T0.[PostDate] >= '${now}' and T0.[PostDate] <= '${now}' and Y.U_MIS_CodeGroup = '${line}'
        Group by
        T0.[U_MIS_NoMesin], Y.U_MIS_CodeGroup, T0.[DocNum], T0.[PostDate],
        T0.[ItemCode], T0.[PlannedQty], T0.[CmpltQty], T0.[Warehouse],
        T0.[U_MIS_NextProc], T0.[Status], T0.[UserSign] Order by Y.U_MIS_CodeGroup asc`);
      return result.recordsets;
    } catch (error) {
      console.error(error);
    }
  },

  async getPercentHistory() {
    try {
      const conn = await mssql;
      const { start, now } = getStartAndBeforeDate();

      const result = await conn.query(`SELECT T0.PostDate,
      CASE WHEN T0.U_MIS_NoMesin BETWEEN 'C01' AND 'C50' THEN 'CAM'
      WHEN T0.U_MIS_NoMesin BETWEEN 'B01' AND 'B51' THEN 'LINE1'
      WHEN T0.U_MIS_NoMesin BETWEEN 'B52' AND 'B72'
      OR T0.U_MIS_NoMesin BETWEEN 'D01' AND 'D35'
      OR T0.U_MIS_NoMesin = 'S003' THEN 'LINE2'
      WHEN T0.U_MIS_NoMesin BETWEEN 'A01' AND 'A53' THEN 'LINE3'
      END AS LineType, (SUM(T0.CmpltQty)/ SUM(T0.PlannedQty) * 100) AS RataRata
      FROM OWOR T0 INNER JOIN WOR1 T1 ON T0.[DocEntry] = T1.[DocEntry]
      WHERE ((T0.U_MIS_NoMesin BETWEEN 'C01' AND 'C50')
      OR (T0.U_MIS_NoMesin BETWEEN 'B01' AND 'B51')
      OR (T0.U_MIS_NoMesin BETWEEN 'B52' AND 'B72'
      OR T0.U_MIS_NoMesin BETWEEN 'D01' AND 'D35'
      OR T0.U_MIS_NoMesin = 'S003')
      OR (T0.U_MIS_NoMesin BETWEEN 'A01' AND 'A53'))
      AND T0.PostDate >= '${start}' AND T0.PostDate <= '${now}'
      AND T0.[UserSign] in (19,22,21) and T0.[Warehouse] = 'WHWIPMF1'
      and T0.[Status] not in ('C')
      GROUP BY T0.PostDate, CASE WHEN T0.U_MIS_NoMesin BETWEEN 'C01' AND 'C50' THEN 'CAM'
      WHEN T0.U_MIS_NoMesin BETWEEN 'B01' AND 'B51' THEN 'LINE1'
      WHEN T0.U_MIS_NoMesin BETWEEN 'B52' AND 'B72'
      OR T0.U_MIS_NoMesin BETWEEN 'D01' AND 'D35'
      OR T0.U_MIS_NoMesin = 'S003' THEN 'LINE2'
      WHEN T0.U_MIS_NoMesin BETWEEN 'A01' AND 'A53' THEN 'LINE3'
      END ORDER BY T0.PostDate DESC`);

      return result.recordsets;
    } catch (error) {
      console.error(error);
    }
  },
};
