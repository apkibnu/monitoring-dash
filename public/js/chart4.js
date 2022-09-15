$(function() {
  /* ChartJS
   * -------
   * Data and config for chartjs
   */
  'use strict';
  const socket = io()
  for (let i = 1; i <= length; i++) { 
    var chartid = "chart" + i;
    var chartiddonut = "chartdonut" + i;
    var data = {
      labels: ["tgl 1", "tgl 2", "tgl 3", "tgl 4", " tgl 5", "tgl 6", "tgl 7"],
      datasets: [{
        label: 'DT',
        categoryPercentage: 0.6,
        barPercentage: 0.5,
        barThickness: 8,
        maxBarThickness: 9,
        minBarLength: 10,
        data: [0,0,0,0],
        backgroundColor: 
        'rgba(255, 175, 0, 0.8)',
          
        borderColor:
          'rgba(255, 175, 0, 1)',

        borderWidth: 1,
        fill: false
      }, {
          label: 'NG  ',
          categoryPercentage: 0.6,
          barPercentage: 0.5,
          barThickness: 8,
          maxBarThickness: 9,
          minBarLength: 10,
          data: [0,0,0,0],
          backgroundColor: 
            'rgba(249, 95, 83, 0.8)',
            
          borderColor:
            'rgba(249, 95, 83, 1)',
  
          borderWidth: 1,
          fill: false
      },{
        label: 'OK',
        categoryPercentage: 0.6,
        barPercentage: 0.5,
        barThickness: 8,
        maxBarThickness: 9,
        minBarLength: 10,
        data: [0,0,0,0],
        backgroundColor: 
        'rgba(52, 177, 170, 0.8)',
          
        borderColor:
        'rgba(52, 177, 170, 1)',

        borderWidth: 1,
        fill: false
      },{
        label: 'Target Produksi',
        data: [0,0,0,0],
        type: 'line',
        borderColor: '#004368',
        datalabels: {
            display: false
      } 
        
      },]
    };
    var options = {
      scales: {
        yAxes: [{
          stacked: true,
          ticks: {
            beginAtZero: true
          },
          gridLines: {
            display: true,
            drawBorder: false,
            color: "rgba(0, 0, 0, 0)",
          }
        }],
        xAxes: [{
          stacked: true,
          ticks: {
            beginAtZero: true
          },
          gridLines: {
            display: true,
            drawBorder: false,
            color: "rgba(0, 0, 0, 0)"
          }
        }]
      },
      legend: {
        display: false
      },
      elements: {
        point: {
          radius: 0,
          hoverRadius: 5,
          hitRadius: 20,
        }
      },
      tooltips: {
        mode: 'label',
        callbacks: {
          label: function (tooltipItem, data) { 
            var type = data.datasets[tooltipItem.datasetIndex].label;
            var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            var total = data.datasets[1].data[tooltipItem.index] + data.datasets[2].data[tooltipItem.index] - data.datasets[3].data[tooltipItem.index];
            if (tooltipItem.datasetIndex !== data.datasets.length - 1) {
                return type + " : " + value.toFixed(0).replace(/(\d)(?=(\d{3})+\.)/g, '1,');
            } else {
                return [type + " : " + value.toFixed(0).replace(/(\d)(?=(\d{3})+\.)/g, '1,'), "Achieved: " + total];
            }
          }
        },
        bodySpacing: 0,
      titleSpacing: 0,
      xPadding: 2,
      yPadding: 2,
      cornerRadius: 2,
      titleMarginBottom: 2,
      }
    };
    
    var doughnutPieData = {
      labels: [
        "Red"
      ],
      datasets: [{
        data: [window[`oee${i}`], 100-window[`oee${i}`]],
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
    if ($(`#barChart${i}`).length) {
      var barChartCanvas = $(`#barChart${i}`).get(0).getContext("2d");
      // This will get the first returned node in the jQuery collection.
      window[chartid] = new Chart(barChartCanvas, {
        type: 'bar',
        data: data,
        options: options
      });
    }
  
  
    if ($(`#donat${i}`).length) {
      var doughnutChartCanvas = $(`#donat${i}`).get(0).getContext("2d");
      window[chartiddonut] = new Chart(doughnutChartCanvas, {
        type: 'doughnut',
        data: doughnutPieData,
        options: doughnutPieOptions
      });
    }
  }

  if (cl == 1) {
    socket.emit('interval-c4', 1)
  } else if (cl == 2) {
    socket.emit('interval-c4', 2)
  } else if (cl == 3) {
    socket.emit('interval-c4', 3)
  } else if (cl == 4) {
    socket.emit('interval-c4', 4)
  } 

  socket.on('update-chart', (arrLable, ok, ng, dt, target, id) => {
    window[`chart${id}`].data.labels = arrLable
    window[`chart${id}`].data.datasets[0].data = dt
    window[`chart${id}`].data.datasets[1].data = ng
    window[`chart${id}`].data.datasets[2].data = ok
    window[`chart${id}`].data.datasets[3].data = target
    window[`chart${id}`].update()
  })

  socket.on('update-oee', (ava, per, qua, oee, id) => {
    document.getElementById(`ava${id}`).style.width = `${ava}%`
    document.getElementById(`ava${id}`).innerHTML = `${ava}%`
    document.getElementById(`per${id}`).style.width = `${per}%`
    document.getElementById(`per${id}`).innerHTML = `${per}%`
    document.getElementById(`qua${id}`).style.width = `${qua}%`
    document.getElementById(`qua${id}`).innerHTML = `${qua}%`
    window[`chartdonut${id}`].data.datasets[0].data = [oee, 100-oee]
    window[`chartdonut${id}`].update()
    document.getElementById(`oee${id}`).innerHTML = `${oee}%`
  })

  socket.on("update-header", (target, total, ok, ng, dt) => {
    document.getElementById(`headTarget`).innerHTML = `${target}`
    document.getElementById(`headTotal`).innerHTML = `${total}`
    document.getElementById(`headOK`).innerHTML = `${ok}`
    document.getElementById(`headNG`).innerHTML = `${ng}`
    document.getElementById(`headDT`).innerHTML = `${dt}`
  })

  socket.on("update-backcard", (ok, ng, dt, id) => {
    document.getElementById(`prog-ok-${id}`).style.width = `${ok}%`
    document.getElementById(`prog-ok-${id}`).innerHTML = `${ok}%`
    document.getElementById(`prog-ng-${id}`).style.width = `${ng}%`
    document.getElementById(`prog-ng-${id}`).innerHTML = `${ng}%`
    document.getElementById(`prog-dt-${id}`).style.width = `${dt}%`
    document.getElementById(`prog-dt-${id}`).innerHTML = `${dt}%`
  })

  socket.on('update-status', (i, stat) => {
    if (stat == 'normal') {
      document.getElementById(`status${i}`).className = 'card-header bg-success rounded-top'
      document.getElementById(`status${i}back`).className = 'card-header bg-success rounded-top'
    } else {
      document.getElementById(`status${i}`).className = 'card-header bg-danger rounded-top'
      document.getElementById(`status${i}back`).className = 'card-header bg-danger rounded-top'
    }
  })
});