let templateLog = {
  type: "line",
  data: {
    datasets: [
      {
        label: "KCP",
        lineTension: 0.15,
        data: [],
        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 0.5
      },
      {
        label: "TCP",
        lineTension: 0.15,
        data: [],
        backgroundColor: ["rgba(30, 255, 132, 0.2)"],
        borderColor: ["rgba(30, 255, 132, 1)"],
        borderWidth: 0.5
      },
      {
        label: "gQUIC",
        lineTension: 0.15,
        data: [],
        backgroundColor: ["rgba(30, 132, 255, 0.2)"],
        borderColor: ["rgba(30, 132, 255, 1)"],
        borderWidth: 0.5
      }
    ]
  },
  options: {
    scales: {
      yAxes: [
        {
          id: "dataSize",
          labels: [],
          ticks: {
            beginAtZero: true
          },
          scaleLabel: {
            display: true,
            labelString: "bytes"
          },
          type: "logarithmic"
        }
      ],
      xAxes: [
        {
          id: "timeInNanoseconds",
          display: true,
          labelString: "Time in Nanoseconds",
          labels: [],
          ticks: {
            beginAtZero: true
          },
          scaleLabel: {
            display: true,
            labelString: "time"
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
        label: "KCP",
        lineTension: 0.15,
        data: [],
        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 0.5
      },
      {
        label: "TCP",
        lineTension: 0.15,
        data: [],
        backgroundColor: ["rgba(30, 255, 132, 0.2)"],
        borderColor: ["rgba(30, 255, 132, 1)"],
        borderWidth: 0.5
      },
      {
        label: "gQUIC",
        lineTension: 0.15,
        data: [],
        backgroundColor: ["rgba(30, 132, 255, 0.2)"],
        borderColor: ["rgba(30, 132, 255, 1)"],
        borderWidth: 0.5
      }
    ]
  },
  options: {
    scales: {
      yAxes: [
        {
          id: "dataSize",
          labels: [],
          ticks: {
            beginAtZero: true
          },
          scaleLabel: {
            display: true,
            labelString: "bytes"
          }
        }
      ],
      xAxes: [
        {
          id: "timeInNanoseconds",
          display: true,
          labelString: "Time in Nanoseconds",
          labels: [],
          ticks: {
            beginAtZero: true
          },
          scaleLabel: {
            display: true,
            labelString: "time"
          }
        }
      ]
    }
  }
};

module.exports = { templateLog, templateLin };
