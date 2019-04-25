const options = {
  responsive: true,
  maintainAspectRatio: true,
  layout: {
    padding: {
      left: 20,
      right: 20,
      top: 0,
      bottom: 10,
    },
  },
  hover: {
    mode: 'x',
    intersect: false,
  },
  title: {
    display: false,
    text: '',
    fontSize: 20,
    padding: 20,
  },
  legend: {
    position: 'bottom',
  },
  tooltips: {
    mode: 'x',
    intersect: false,
    callbacks: {},
  },
  elements: {
    line: {
      fill: false,
    },
    point: {
      radius: 0,
      hitRadius: 2,
      hoverRadius: 5,
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
