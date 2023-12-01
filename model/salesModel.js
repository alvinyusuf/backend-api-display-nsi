/* eslint-disable consistent-return */
const mssql = require('../services/database/mssql');
const mysql = require('../services/database/mysql');
const getDateNow = require('../utils/getDateNow');
const getStartOfMonth = require('../utils/getStartOfMonth');
const getFormatDate = require('../utils/productions');

module.exports = {
  async getListCostumer() {
    try {
      const conn = await mssql;
      const now = getDateNow();
      const start = getStartOfMonth();
      const query = `SELECT Target.tahun AS tahun, Target.bulan AS bulan,
        Target.namaCustomer, Target.namaCustomer1, Target.totalTargetQuantity,
        Aktual.totalAktualQuantity, Target.totalTargetUSD, Aktual.totalAktualUSD
        FROM (SELECT T0.[CardName] as 'namaCustomer',
        SUM(T1.[Quantity] - ISNULL(v.[quantity], 0) - ISNULL(x.[quantity], 0)) AS totalAktualQuantity,
        SUM(
          CASE
            WHEN T1.Currency = 'IDR' THEN T1.Price * T1.Quantity / f.Rate
            WHEN T1.Currency = 'JPY' THEN T1.Price * T1.Quantity / f.Rate
            ELSE T1.Price * T1.Quantity
          END
        ) AS totalAktualUSD
        FROM ODLN T0 INNER JOIN DLN1 T1 ON T0.[DocEntry] = T1.[DocEntry]
        LEFT JOIN (
          SELECT baseentry, basetype, baseline, SUM(quantity) AS [quantity]
          FROM rdn1 WITH (NOLOCK) GROUP BY baseentry, basetype, baseline
        ) v ON v.BaseEntry = T1.DocEntry AND v.BaseType = T1.ObjType AND v.BaseLine = T1.LineNum
        LEFT JOIN (
          SELECT a.baseentry, a.basetype, a.baseline, SUM(b.quantity) AS [quantity]
          FROM inv1 a WITH (NOLOCK) LEFT JOIN RIN1 b WITH (NOLOCK) ON a.DocEntry = b.BaseEntry
          AND a.ObjType = b.BaseType AND a.LineNum = b.BaseLine
          GROUP BY a.baseentry, a.basetype, a.baseline
        ) x ON x.BaseEntry = T1.DocEntry AND x.BaseType = T1.ObjType AND x.BaseLine = T1.LineNum
        LEFT JOIN ortt f ON T1.Currency = f.Currency AND T1.DocDate = f.RateDate
        WHERE T0.DocDate >= '${start}' AND T0.DocDate <= '${now}'
        AND (
          T1.LineStatus = 'O' OR (T0.CANCELED NOT IN ('Y', 'C'))
          OR (
            T1.LineStatus = 'C' AND ISNULL(t1.Targettype, '-1') NOT IN ('-1', '15')
            AND ISNULL(t1.TrgetEntry, '') <> ''
          )
        ) AND (
          T1.[Quantity] - ISNULL(v.[quantity], 0) - ISNULL(x.[quantity], 0)
        ) <> 0
      GROUP BY T0.[CardName]) AS Aktual
      JOIN (
        SELECT d.U_MIS_InCusName as 'namaCustomer', DATEPART(yy, b.Date) AS tahun,
          DATENAME(MONTH, b.Date) AS bulan, d.CardName AS 'namaCustomer1',
          SUM(b.quantity) AS totalTargetQuantity,
          SUM(
            CASE
              WHEN c.currency = 'IDR' THEN c.price * b.quantity / f.rate
              WHEN c.currency = 'JPY' THEN c.price * b.quantity / f.rate
              ELSE c.price * b.quantity
            END
          ) AS totalTargetUSD
        FROM ofct a LEFT JOIN FCT1 b ON a.AbsID = b.AbsID
        LEFT JOIN itm1 c ON b.ItemCode = c.ItemCode
        LEFT JOIN ocrd d ON a.Name = d.CardCode
        LEFT JOIN ortt f ON c.currency = f.currency AND b.Date = f.RateDate
        LEFT JOIN oitm g ON b.itemcode = g.itemcode
        WHERE b.Date >= '${start}' AND b.Date <= '${now}'
        AND c.PriceList = 1 AND g.Validfor = 'Y'
        GROUP BY DATEPART(yy, b.Date), DATENAME(MONTH, b.Date), d.CardName, d.U_MIS_InCusName
      ) AS Target
      ON Aktual.namaCustomer = Target.namaCustomer1`;
      const result = await conn.query(query);
      return result.recordset;
    } catch (error) {
      console.error(error);
    }
  },

  async getActualOnYear() {
    try {
      const conn = await mssql;
      const now = getDateNow();
      const year = new Date().getFullYear();
      const query = `SELECT SUM("TOTAL USD PRICE") AS "totalUSDSales"
        FROM (
          SELECT T0.[DocEntry], T0.[DocNum], T0.[DocStatus],
          T0.[DocDate], T0.[CardCode], T0.[CardName], T1.[ItemCode],
          T1.[Quantity], T1.[U_MIS_Packing], T1.Price, T1.Currency,
          CASE
            WHEN T1.Currency = 'IDR' THEN T1.Price * T1.Quantity / f.Rate
            WHEN T1.Currency = 'JPY' THEN T1.Price * T1.Quantity / f.Rate
            ELSE T1.Price * T1.Quantity
          END AS 'TOTAL USD PRICE'
          FROM ODLN T0 INNER JOIN DLN1 T1 ON T0.[DocEntry] = T1.[DocEntry]
          LEFT JOIN (
            SELECT baseentry, basetype, baseline, SUM(quantity) AS [quantity]
            FROM rdn1 WITH (NOLOCK) GROUP BY baseentry, basetype, baseline
          ) v ON v.BaseEntry = T1.DocEntry AND v.BaseType = T1.ObjType AND v.BaseLine = T1.LineNum
          LEFT JOIN (
            SELECT a.baseentry, a.basetype, a.baseline, SUM(b.quantity) AS [quantity]
            FROM inv1 a WITH (NOLOCK)
            LEFT JOIN RIN1 b WITH (NOLOCK) ON a.DocEntry = b.BaseEntry AND a.ObjType = b.BaseType
            AND a.LineNum = b.BaseLine GROUP BY a.baseentry, a.basetype, a.baseline
          ) x ON x.BaseEntry = T1.DocEntry
          AND x.BaseType = T1.ObjType AND x.BaseLine = T1.LineNum
          LEFT JOIN ortt f ON T1.Currency = f.Currency AND T1.DocDate = f.RateDate
          WHERE T0.DocDate >= '01-01-${year}' AND T0.DocDate <= '${now}'
          AND (T1.LineStatus = 'O' OR (T0.CANCELED NOT IN ('Y', 'C'))
          OR (T1.LineStatus = 'C' AND ISNULL(t1.Targettype, '-1') NOT IN ('-1', '15')  AND ISNULL(t1.TrgetEntry, '') <> ''))
          AND (T1.[Quantity] - ISNULL(v.[quantity], 0) - ISNULL(x.[quantity], 0)) <> 0
        ) AS SalesData`;

      const result = await conn.query(query);
      return result.recordset;
    } catch (error) {
      console.error(error);
    }
  },

  async getDetailActual() {
    try {
      const conn = await mssql;
      const now = getFormatDate(new Date());
      const year = new Date().getFullYear();
      const query = `SELECT
        FORMAT(T0.[DocDate], 'MMMM') AS [bulan],
        SUM(
          CASE
            WHEN T1.Currency = 'IDR' THEN T1.Price * T1.Quantity / f.Rate
            WHEN T1.Currency = 'JPY' THEN T1.Price * T1.Quantity / f.Rate
            ELSE T1.Price * T1.Quantity
          END
        ) AS 'totalUSDPrice'
        FROM ODLN T0
        INNER JOIN DLN1 T1 ON T0.[DocEntry] = T1.[DocEntry]
        LEFT JOIN (SELECT baseentry, basetype, baseline, SUM(quantity) AS [quantity]
          FROM rdn1 WITH (NOLOCK)
          GROUP BY baseentry, basetype, baseline) v ON v.BaseEntry = T1.DocEntry AND v.BaseType = T1.ObjType AND v.BaseLine = T1.LineNum
        LEFT JOIN (SELECT a.baseentry, a.basetype, a.baseline, SUM(b.quantity) AS [quantity]
          FROM inv1 a WITH (NOLOCK)
          LEFT JOIN RIN1 b WITH (NOLOCK) ON a.DocEntry = b.BaseEntry AND a.ObjType = b.BaseType AND a.LineNum = b.BaseLine
          GROUP BY a.baseentry, a.basetype, a.baseline) x ON x.BaseEntry = T1.DocEntry AND x.BaseType = T1.ObjType AND x.BaseLine = T1.LineNum
        LEFT JOIN ortt f ON T1.Currency = f.Currency AND T1.DocDate = f.RateDate
        WHERE T0.DocDate >= '01-01-${year}' AND T0.DocDate <= '${now}'
          AND (T1.LineStatus = 'O' OR (T0.CANCELED NOT IN ('Y', 'C'))
          OR (T1.LineStatus = 'C' AND ISNULL(t1.Targettype, '-1') NOT IN ('-1', '15') AND ISNULL(t1.TrgetEntry, '') <> ''))
          AND (T1.[Quantity] - ISNULL(v.[quantity], 0) - ISNULL(x.[quantity], 0)) <> 0
        GROUP BY FORMAT(T0.[DocDate], 'MMMM')
        ORDER BY MIN(T0.[DocDate])`;

      const result = await conn.query(query);
      return result.recordset;
    } catch (error) {
      console.error(error);
    }
  },

  async getMonthlyTarget(callback) {
    try {
      mysql.query(`SELECT januari, februari, maret, april, mei, juni,
      juli, agustus, september, oktober, november, desember
      FROM target_sales WHERE YEAR(tahun) = YEAR(NOW())`, callback);
    } catch (error) {
      console.error(error);
    }
  },
};
