const darkColors = [
  '#004c99',
  '#99004c',
  '#4682B4',
  '#2ca12c',
  '#999900',
  '#CC6600',
  '#858585',
  '#008080',
  '#0000CC',
  '#A9A9A9',
];

const lightColors = [
  '#BA55D3',
  '#4682B4',
  '#FF69B4',
  '#87CEEB',
  '#9ACD32',
  '#6B8E23',
  '#FF8C00',
  '#A9A9A9',
  '#008080',
  '#D3D3D3',
];

const getRandomColor = (theme, index) => {
  if (theme === 'dark-mode') {
    return darkColors[index];
  }
  return lightColors[index];
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
