let templateLog = {
  type: "line",
  data: {
    datasets: [
      {
        label: "KCP time in nanoseconds",
        lineTension: 0.4,
        data: [],
        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 0.5
      },
      {
        label: "gQUIC time in nanoseconds",
        lineTension: 0.4,
        data: [],
        backgroundColor: ["rgba(30, 255, 132, 0.2)"],
        borderColor: ["rgba(30, 255, 132, 1)"],
        borderWidth: 0.5
      },
      {
        label: "TCP time in nanoseconds",
        lineTension: 0.4,
        data: [],
        backgroundColor: ["rgba(30, 132, 255, 0.2)"],
        borderColor: ["rgba(30, 132, 255, 1)"],
        borderWidth: 0.5
      }
    ]
  },
  options: {
    animation: {
      duration: 3000
    },
    responsiveAnimationDuration: 2000,
    hover: {
      animationDuration: 1000
    },
    scales: {
      yAxes: [
        {
          id: "time",
          labels: [],
          ticks: {
            beginAtZero: true
          },
          scaleLabel: {
            display: true,
            labelString: "time in nanoseconds"
          },
          type: "logarithmic"
        }
      ],
      xAxes: [
        {
          id: "size",
          display: true,
          labels: [],
          ticks: {
            beginAtZero: true
          },
          scaleLabel: {
            display: true,
            labelString: "bytes"
          }
        }
      ]
    }
  }
};

let templateLin = {
  type: "line",
  data: {
    datasets: [
      {
        label: "KCP time in nanoseconds",
        lineTension: 0.4,
        data: [],
        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 0.5
      },
      {
        label: "gQUIC time in nanoseconds",
        lineTension: 0.4,
        data: [],
        backgroundColor: ["rgba(30, 255, 132, 0.2)"],
        borderColor: ["rgba(30, 255, 132, 1)"],
        borderWidth: 0.5
      },
      {
        label: "TCP time in nanoseconds",
        lineTension: 0.4,
        data: [],
        backgroundColor: ["rgba(30, 132, 255, 0.2)"],
        borderColor: ["rgba(30, 132, 255, 1)"],
        borderWidth: 0.5
      }
    ]
  },
  options: {
    animation: {
      duration: 3000
    },
    responsiveAnimationDuration: 2000,
    hover: {
      animationDuration: 1000
    },
    scales: {
      yAxes: [
        {
          id: "time",
          labels: [],
          ticks: {
            beginAtZero: true
          },
          scaleLabel: {
            display: true,
            labelString: "time in nanoseconds"
          }
        }
      ],
      xAxes: [
        {
          id: "size",
          display: true,
          labels: [],
          ticks: {
            beginAtZero: true
          },
          scaleLabel: {
            display: true,
            labelString: "bytes"
          }
        }
      ]
    }
  }
};

module.exports = { templateLog, templateLin };
