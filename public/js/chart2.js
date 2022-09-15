$(function() {
  /* ChartJS
   * -------
   * Data and config for chartjs
   */
  'use strict';
  var data = {
    labels: ["tgl today", "", "", "", "", "", "", "", "jam"],
    datasets: [{
      label: 'Produksi',
      categoryPercentage: 0.6,
      barPercentage: 0.5,
      barThickness: 8,
      maxBarThickness: 9,
      minBarLength: 10,
      data: [1000, 1000,807, 904, 960, 590, 720,],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
      ],
      borderWidth: 1,
      fill: false
    }]
  };
  var multiLineData = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [{
        label: 'Dataset 1',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: [
          '#587ce4'
        ],
        borderWidth: 2,
        fill: false
      },
      {
        label: 'Dataset 2',
        data: [5, 23, 7, 12, 42, 23],
        borderColor: [
          '#ede190'
        ],
        borderWidth: 2,
        fill: false
      },
      {
        label: 'Dataset 3',
        data: [15, 10, 21, 32, 12, 33],
        borderColor: [
          '#f44252'
        ],
        borderWidth: 2,
        fill: false
      }
    ]
  };
  var options = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
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
  var doughnutPieData = {
    labels: [
      "Red"
    ],
    datasets: [{
      data: [30, 70],
      backgroundColor: [
        'rgba(255, 99, 132)',
      ],
    }]

  };
  var doughnutPieOptions = {
    responsive: true,
    cutoutPercentage: 70,
    animation: {
      animateScale: true,
      animateRotate: true
    },
    legend: {
      display: false
    }
    
  };


  // Get context with jQuery - using jQuery's .get() method.
  if ($("#barChart").length) {
    var barChartCanvas = $("#barChart").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    var barChart = new Chart(barChartCanvas, {
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

  if ($("#donat").length) {
    var doughnutChartCanvas = $("#donat").get(0).getContext("2d");
    var doughnutChart = new Chart(doughnutChartCanvas, {
      type: 'doughnut',
      data: doughnutPieData,
      options: doughnutPieOptions
    });
  }

  if ($("#browserTrafficChart").length) {
    var doughnutChartCanvas = $("#browserTrafficChart").get(0).getContext("2d");
    var doughnutChart = new Chart(doughnutChartCanvas, {
      type: 'doughnut',
      data: browserTrafficData,
      options: doughnutPieOptions
    });
  }


  /* <---CHART 2---> */
  var data2 = {
    labels: ["tgl today", "", "", "", "", "", "", "", "jam"],
    datasets: [{
      label: 'Produksi',
      categoryPercentage: 0.6,
      barPercentage: 0.5,
      barThickness: 8,
      maxBarThickness: 9,
      minBarLength: 10,
      data: [1000, 1000,807, 904, 960, 590, 720,],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
      ],
      borderWidth: 1,
      fill: false
    }]
  };

  var options2 = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
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

  var doughnutPieData2 = {
    labels: [
      "Red"
    ],
    datasets: [{
      data: [30, 70],
      backgroundColor: [
        'rgba(255, 99, 132)',
      ],
    }]

  };
  var doughnutPieOptions2 = {
    responsive: true,
    cutoutPercentage: 70,
    animation: {
      animateScale: true,
      animateRotate: true
    },
    legend: {
      display: false
    }
    
  };

  
  if ($("#barChart2").length) {
    var barChartCanvas = $("#barChart2").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    var barChart = new Chart(barChartCanvas, {
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

  /* <---LINE 1 CHART 3---> */
  var data3 = {
    labels: ["tgl today", "", "", "", "", "", "", "", "jam"],
    datasets: [{
      label: 'Produksi',
      categoryPercentage: 0.6,
      barPercentage: 0.5,
      barThickness: 8,
      maxBarThickness: 9,
      minBarLength: 10,
      data: [1000, 1000,807, 904, 960, 590, 720,],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(54, 162, 235, 0.8)',
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
      ],
      borderWidth: 1,
      fill: false
    }]
  };

  var options3 = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
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

  var doughnutPieData3 = {
    labels: [
      "Red"
    ],
    datasets: [{
      data: [30, 70],
      backgroundColor: [
        'rgba(255, 99, 132)',
      ],
    }]

  };
  var doughnutPieOptions3 = {
    responsive: true,
    cutoutPercentage: 70,
    animation: {
      animateScale: true,
      animateRotate: true
    },
    legend: {
      display: false
    }
    
  };

  
  if ($("#barChart3").length) {
    var barChartCanvas = $("#barChart3").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    var barChart = new Chart(barChartCanvas, {
      type: 'bar',
      data: data3,
      options: options3
    });
  }

  if ($("#donat3").length) {
    var doughnutChartCanvas = $("#donat3").get(0).getContext("2d");
    var doughnutChart = new Chart(doughnutChartCanvas, {
      type: 'doughnut',
      data: doughnutPieData3,
      options: doughnutPieOptions3
    });
  }
});