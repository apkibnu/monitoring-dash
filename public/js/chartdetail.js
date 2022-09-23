$(function() {
  /* ChartJS
   * -------
   * Data and config for chartjs
   */
  'use strict';
  const socket = io();
  var data = {
    labels: lblNG,
    datasets: [{
      label: 'Pcs',
      categoryPercentage: 0.6,
      barPercentage: 0.5,
      barThickness: 15,
      maxBarThickness: 70,
      minBarLength: 10,
      data: detNG,
      backgroundColor: 
        'rgba(255, 99, 132, 0.7)',
      borderColor: 
        'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      fill: false
    }]
  };
  var options = {
    scales: {
      xAxes: [{
        gridLines: {
            color: "rgba(0, 0, 0, 0)",
        }
      }],
      
      yAxes: [{
        ticks: {
          beginAtZero: true
        },
        gridLines: {
          color: "rgba(0, 0, 0, 0)",
        }
      }]
    },
    legend: {
      display: false
    },
    elements: {
      point: {
        radius: 0
      }
    },
  };
  // Get context with jQuery - using jQuery's .get() method.
  if ($("#barChart").length) {
    var barChartCanvas = $("#barChart").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    var barChartNG = new Chart(barChartCanvas, {
      type: 'bar',
      data: data,
      options: options
    });
  }

  if ($("#lineChart").length) {
    var lineChartCanvas = $("#lineChart").get(0).getContext("2d");
    var lineChart = new Chart(lineChartCanvas, {
      type: 'line',
      data: data,
      options: options
    });
  }

  /* <---CHART 2---> */
  var data2 = {
    labels: ["DT MATERIAL", "DT PROCESS", "DT MACHINE", "DT AUTOMATION", "DT OTHERS", "DT TERPLANNING"],
    datasets: [{
      label: 'Menit',
      categoryPercentage: 0.6,
      barPercentage: 0.5,
      barThickness: 50,
      maxBarThickness: 70,
      minBarLength: 10,
      data: valDT,
      backgroundColor: 
        'rgba(255, 175, 0, 0.7)'
      ,
      borderColor: 
      'rgba(255, 175, 0, 1)'
      ,
      borderWidth: 1,
      fill: false
    }]
  };

  var options2 = {
    scales: {
      xAxes: [{
        gridLines: {
            color: "rgba(0, 0, 0, 0)",
        }
      }],
      
      yAxes: [{
        ticks: {
          beginAtZero: true
        },
        gridLines: {
          color: "rgba(0, 0, 0, 0)",
        }
      }]
    },
    legend: {
      display: false
    },
    elements: {
      point: {
        radius: 0
      }
    },
  };

  if ($("#barChart2").length) {
    var barChartCanvas = $("#barChart2").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    var barChartDT = new Chart(barChartCanvas, {
      type: 'bar',
      data: data2,
      options: options2
    });
  }

  if ($("#donat2").length) {
    var doughnutChartCanvas = $("#donat2").get(0).getContext("2d");
    var doughnutChart = new Chart(doughnutChartCanvas, {
      type: 'doughnut',
      data: doughnutPieData2,
      options: doughnutPieOptions2
    });
  }

  socket.on('update-chart-ng', (val, lable) => {
    barChartNG.data.datasets[0].data = val
    barChartNG.update()
  })

  socket.on('update-chart-dt', (val) => {
    barChartDT.data.datasets[0].data = val
    barChartDT.update()
  })
  
  socket.on('update-header-det', (total, ng, ok, dt, target) => {
    document.getElementById('headOK').innerHTML = ok || 0
    document.getElementById('headNG').innerHTML = ng || 0
    document.getElementById('headDT').innerHTML = dt
    document.getElementById('headTP').innerHTML = total || 0
    document.getElementById('target').innerHTML = target || 0
  })
});