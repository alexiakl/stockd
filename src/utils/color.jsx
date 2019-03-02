const darkColors = [
  '#004c99',
  '#99004c',
  '#4c0099',
  '#00994c',
  '#999900',
  '#CC6600',
  '#000000',
  '#008080',
  '#A9A9A9',
  '#0000CC',
];

const getRandomColor = (theme, index) => {
  if (theme === 'dark-mode') {
    return darkColors[index];
  }
  return darkColors[index];
};

const getPerformanceColor = value => {
  if (value > 0) {
    return 'green';
  }
  if (value < 0) {
    return 'red';
  }
  return '';
};

const getPerformanceColorHex = value => {
  if (value > 0) {
    return '#24a321';
  }
  if (value < 0) {
    return '#af2725';
  }
  return '#666';
};

export { getRandomColor, getPerformanceColor, getPerformanceColorHex };
