const options = {
  responsive: true,
  maintainAspectRatio: true,
  tooltips: {
    mode: 'label',
  },
  elements: {
    line: {
      fill: false,
    },
  },
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: { display: false },
        labels: [],
      },
    ],
    yAxes: [
      {
        type: 'linear',
        display: true,
        position: 'left',
        id: 'y-axis-1',
        ticks: {
          beginAtZero: false,
        },
        gridLines: {
          zeroLineColor: '#888',
          zeroLineWidth: 2,
          display: true,
        },
        labels: {
          show: true,
        },
      },
    ],
  },
};

exports.options = options;
