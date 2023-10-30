/* eslint-disable consistent-return */
const mssql = require('../config/mssql');
const getFormatDate = require('../utils/productions');

module.exports = {
  async getPercentProduction(line) {
    try {
      const conn = await mssql;
      const now = getFormatDate(new Date());

      const result = await conn.query(`/* SELECT * FROM OFPR T0 */
        /* SELECT * FROM [@MASTERMESIN] Y  */
        Declare @StartDate Date Declare @EndDate Date
        declare @GroupMsn nvarchar(40) if isnull(@GroupMsn,'')='' SET
        @GroupMsn = 'All' SELECT TOP 1 avg(x.CmpltQty/x.PlannedQty) * 100 'percen'
        FROM OWOR T0 LEFT JOIN WOR1 T1 ON T0.[DocEntry] = T1.[DocEntry]
        LEFT JOIN [@MASTERMESIN] Y on T0.U_MIS_NoMesin = Y.Code cross JOIN
        (Select SUM(A.CmpltQty) CmpltQty , sum(A.PlannedQty) PlannedQty
        from OWOR A LEFT JOIN [@MASTERMESIN] Y on A.U_MIS_NoMesin = Y.Code
        where A.[UserSign] =19 and A.[Warehouse] = 'WHWIPMF1' and Y.U_MIS_CodeGroup='${line}'
        and A.[Status] not in ('C') and A.[PostDate] >= '${now}' and A.[PostDate] <= '${now}'
        and case when isnull (@GroupMsn , 'ALL') = 'ALL' then '1' else y.U_MIS_CodeGroup end = case
        when isnull(@GroupMsn,'All')='ALL' then '1' else @GroupMsn end) X WHERE T0.[UserSign] in (19,22,21)
        and T0.[Warehouse] = 'WHWIPMF1' and Y.U_MIS_CodeGroup='${line}' and T0.[Status] not in ('C') and
        T0.[PostDate] >= '${now}' and T0.[PostDate] <= '${now}'  and case
        when isnull (@GroupMsn , 'ALL') = 'ALL' then '1' else y.U_MIS_CodeGroup end = case
        when isnull(@GroupMsn,'All')='ALL' then '1' else @GroupMsn end Group by T0.[U_MIS_NoMesin],
        Y.U_MIS_CodeGroup, T0.[DocNum], T0.[PostDate], T0.[ItemCode], T0.[PlannedQty], T0.[CmpltQty],
        T0.[Warehouse], T0.[U_MIS_NextProc], T0.[Status], T0.[UserSign] Order by Y.U_MIS_CodeGroup asc`);

      return result.recordset;
    } catch (error) {
      console.error(error);
    }
  },

  async getPercentAllLine() {
    try {
      const conn = await mssql;
      const now = getFormatDate(new Date());

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
        WHERE T0.[UserSign] in (19,22,21) and T0.[Warehouse] = 'WHWIPMF1'
        and T0.[Status] not in ('C') and T0.[PostDate] >= '${now}' and T0.[PostDate] <= '${now}'
        Group by
        T0.[U_MIS_NoMesin], Y.U_MIS_CodeGroup, T0.[DocNum], T0.[PostDate],
        T0.[ItemCode], T0.[PlannedQty], T0.[CmpltQty], T0.[Warehouse],
        T0.[U_MIS_NextProc], T0.[Status], T0.[UserSign] Order by Y.U_MIS_CodeGroup asc`);

      return result.recordsets;
    } catch (error) {
      console.error(error);
    }
  },

  async getPercentSpecificLine(line) {
    try {
      const conn = await mssql;
      const now = getFormatDate(new Date());

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
      const now = getFormatDate(new Date(), false, true);
      const start = getFormatDate(new Date(), true);

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
      AND T0.[UserSign] in (19,22,21) and T0.[Warehouse] = 'WHWIPMF1' and T0.[Status] not in ('C')
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
