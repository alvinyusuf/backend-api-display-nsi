const doubleFilter = (data) => {
  const newData = data.map((subArray) => {
    if (!subArray[0] || !subArray[0].PostDate) {
      return null;
    }

    const tanggal = JSON.stringify(subArray[0].PostDate).split('T')[0].replace(/"/g, '');
    const [year, month, day] = tanggal.split('-');
    const newTgl = `${day}-${month}-${year}`;
    const subData = subArray.map((item) => ({
      LineType: item.LineType,
      RataRata: item.RataRata,
    }));
    return { tgl: newTgl, data: subData };
  }).filter((item) => item !== null);

  return newData;
};

module.exports = doubleFilter;
