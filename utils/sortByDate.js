const sortByDate = (data) => {
  const array = data[0];
  const groupedData = {};

  array.forEach((item) => {
    const tanggal = JSON.stringify(item.PostDate).split('T')[0];
    if (!groupedData[tanggal]) {
      groupedData[tanggal] = [];
    }
    groupedData[tanggal].push(item);
  });

  const hasil = Object.values(groupedData);
  return hasil;
};

module.exports = sortByDate;
