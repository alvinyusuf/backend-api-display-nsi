/* eslint-disable consistent-return */
const mssql = require('../services/database/mssqlSales');
const getFormatDate = require('../utils/productions');

module.exports = {
  async getListCostumer() {
    try {
      const conn = await mssql;
      const now = getFormatDate(new Date());
      const start = getFormatDate(new Date(), true);
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

  async getDetailCustomer(customer) {
    try {
      const conn = await mssql;
      const now = getFormatDate(new Date());
      const start = getFormatDate(new Date(), true);
      const query = `SELECT
      Target.tahun AS tahun,
      Target.bulan AS bulan,
      Target.namaCustomer,
      Target.ItemCode as itemCode,
      SUM(Target.Quantity) as totalTargetQty,
      SUM(Aktual.quantity) as totalAktualQty,
      SUM(Target.totalUSD) as totalTargetUSD,
      SUM(Aktual.totalUSD) as totalAktualUSD
  FROM (
      SELECT
          T0.[DocDate] as 'date',
          T0.[CardName] as 'namaCustomer',
          T1.[itemCode],
          T1.[Quantity] - ISNULL(v.[quantity], 0) - ISNULL(x.[quantity], 0) AS [quantity],
          T1.Price as 'price',
          CASE
              WHEN T1.Currency = 'IDR' THEN T1.Price * T1.Quantity / f.Rate
              WHEN T1.Currency = 'JPY' THEN T1.Price * T1.Quantity / f.Rate
              ELSE T1.Price * T1.Quantity
          END AS 'totalUSD'
      FROM
          ODLN T0
          INNER JOIN DLN1 T1 ON T0.[DocEntry] = T1.[DocEntry]
          LEFT JOIN (
              SELECT
                  baseentry,
                  basetype,
                  baseline,
                  SUM(quantity) AS [quantity]
              FROM
                  rdn1 WITH (NOLOCK)
              GROUP BY
                  baseentry,
                  basetype,
                  baseline
          ) v ON v.BaseEntry = T1.DocEntry
          AND v.BaseType = T1.ObjType
          AND v.BaseLine = T1.LineNum
          LEFT JOIN (
              SELECT
                  a.baseentry,
                  a.basetype,
                  a.baseline,
                  SUM(b.quantity) AS [quantity]
              FROM
                  inv1 a WITH (NOLOCK)
                  LEFT JOIN RIN1 b WITH (NOLOCK) ON a.DocEntry = b.BaseEntry
                  AND a.ObjType = b.BaseType
                  AND a.LineNum = b.BaseLine
              GROUP BY
                  a.baseentry,
                  a.basetype,
                  a.baseline
          ) x ON x.BaseEntry = T1.DocEntry
          AND x.BaseType = T1.ObjType
          AND x.BaseLine = T1.LineNum
          LEFT JOIN ortt f ON T1.Currency = f.Currency
          AND T1.DocDate = f.RateDate
      WHERE
          T0.DocDate >= '${start}'
          AND T0.DocDate <= '${now}'
          AND (
              T1.LineStatus = 'O'
              OR (T0.CANCELED NOT IN ('Y', 'C'))
              OR (
                  T1.LineStatus = 'C'
                  AND ISNULL(t1.Targettype, '-1') NOT IN ('-1', '15')
                  AND ISNULL(t1.TrgetEntry, '') <> ''
              )
          )
          AND (
              T1.[Quantity] - ISNULL(v.[quantity], 0) - ISNULL(x.[quantity], 0)
          ) <> 0
  ) as Aktual
  JOIN (
      SELECT
          Datepart (yy, b.Date) as tahun,
          DATENAME(MONTH, b.Date) AS bulan,
          d.U_MIS_InCusName as 'namaCustomer',
          b.itemCode,
          b.quantity,
          c.price,
          CASE
          WHEN c.currency = 'IDR' THEN c.price * b.quantity / f.rate
          WHEN c.currency = 'JPY' THEN c.price * b.quantity / f.rate
          ELSE c.price * b.quantity
          END AS 'totalUSD'
      FROM ofct a
      LEFT JOIN ocrd d ON a.Name = d.CardCode
      LEFT JOIN FCT1 b ON a.AbsID = b.AbsID
      LEFT JOIN itm1 c ON b.ItemCode = c.ItemCode
      LEFT JOIN ortt f ON c.currency = f.currency
      AND b.Date = f.RateDate
      LEFT JOIN oitm g ON b.itemcode = g.itemcode
      WHERE
      d.U_MIS_InCusName = '${customer}' AND
      b.Date >= '${start}'
      AND b.Date <= '${now}'
      AND c.PriceList = 1
      AND g.Validfor = 'Y'
  ) as Target
  ON Aktual.ItemCode = Target.ItemCode
  GROUP BY Target.tahun, Target.bulan, Target.namaCustomer, Target.ItemCode
        ORDER BY Target.namaCustomer, Target.ItemCode`;

      const result = await conn.query(query);
      return result.recordset;
    } catch (error) {
      console.error(error);
    }
  },

  async cekImprove(customer) {
    try {
      const conn = await mssql;
      const now = getFormatDate(new Date());
      const start = getFormatDate(new Date(), true);
      const query = `SELECT Target.tahun AS tahun, Target.bulan AS bulan, Target.namaCustomer,
        Target.ItemCode as itemCode, Target.Quantity as totalTargetQty, SUM(Aktual.quantity) as totalAktualQty,
        Target.totalUSD as totalTargetUSD, SUM(Aktual.totalUSD) as totalAktualUSD
        FROM (
          SELECT T0.[DocEntry], T0.[DocNum], T0.[DocStatus], T0.[DocDate], T0.[CardCode],
          T0.[CardName], T1.[ItemCode], T1.[Quantity] - ISNULL(v.[quantity], 0) - ISNULL(x.[quantity], 0) AS [Quantity],
          T1.[U_MIS_Packing], T1.Price, T1.Currency, T1.Price * T1.Quantity AS 'Qty X Harga',
          CASE
          WHEN T1.Currency = 'IDR' THEN T1.Price * T1.Quantity / f.Rate
          WHEN T1.Currency = 'JPY' THEN T1.Price * T1.Quantity / f.Rate
          ELSE T1.Price * T1.Quantity
          END AS 'totalUSD'
          FROM ODLN T0 INNER JOIN DLN1 T1 ON T0.[DocEntry] = T1.[DocEntry]
          LEFT JOIN (SELECT baseentry, basetype, baseline, SUM(quantity) AS [quantity]
          FROM rdn1 WITH (NOLOCK) GROUP BY baseentry, basetype, baseline) v ON v.BaseEntry = T1.DocEntry
          AND v.BaseType = T1.ObjType AND v.BaseLine = T1.LineNum
          LEFT JOIN (SELECT a.baseentry, a.basetype, a.baseline, SUM(b.quantity) AS [quantity]
          FROM inv1 a WITH (NOLOCK)
          LEFT JOIN RIN1 b WITH (NOLOCK) ON a.DocEntry = b.BaseEntry AND a.ObjType = b.BaseType
          AND a.LineNum = b.BaseLine GROUP BY a.baseentry, a.basetype, a.baseline) x ON x.BaseEntry = T1.DocEntry
          AND x.BaseType = T1.ObjType AND x.BaseLine = T1.LineNum
          LEFT JOIN ortt f ON T1.Currency = f.Currency AND T1.DocDate = f.RateDate
          WHERE T0.DocDate >= '${start}' AND T0.DocDate <= '${now}'
          AND (T1.LineStatus = 'O' OR (T0.CANCELED NOT IN ('Y', 'C'))
          OR (T1.LineStatus = 'C' AND ISNULL(t1.Targettype, '-1') NOT IN ('-1', '15')  AND ISNULL(t1.TrgetEntry, '') <> ''))
          AND (T1.[Quantity] - ISNULL(v.[quantity], 0) - ISNULL(x.[quantity], 0)) <> 0
        ) AS Aktual
        RIGHT JOIN (
          SELECT a.Name, d.CardName as 'namaCustomer', b.ItemCode, b.Quantity, Datepart (yy, b.Date) as tahun,
            DATENAME(MONTH, b.Date) AS Bulan, c.Currency, c.Price, c.price * b.quantity AS 'Qty X Harga',
            CASE
            WHEN c.currency = 'IDR' THEN c.price * b.quantity / f.rate
            WHEN c.currency = 'JPY' THEN c.price * b.quantity / f.rate
            ELSE c.price * b.quantity
            END AS 'totalUSD'
            from ofct a
            left join FCT1 b on a.AbsID = b.AbsID
            left join itm1 c on b.ItemCode = c.ItemCode
            left join ocrd d on a.Name = d.CardCode
            left join ortt f on c.currency = f.currency and b.Date = f.RateDate
            left join oitm g on b.itemcode = g.itemcode
          WHERE
          d.CardName = '${customer}' AND
          b.Date >= '${start}' and b.Date <= '${now}'
          and
          c.PriceList = 1
          and
          g.Validfor = 'Y'
        ) as Target
        ON Aktual.ItemCode = Target.ItemCode
        GROUP BY Target.tahun, Target.bulan, Target.namaCustomer, Target.ItemCode, Target.Quantity, Target.totalUSD
        ORDER BY Target.namaCustomer, Target.ItemCode`;

      const result = await conn.query(query);
      return result.recordset;
    } catch (error) {
      console.error(error);
    }
  },

  async getActualOnYear() {
    try {
      const conn = await mssql;
      const now = getFormatDate(new Date());
      const today = new Date();
      const year = today.getFullYear();
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
      const today = new Date();
      const year = today.getFullYear();
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
};
