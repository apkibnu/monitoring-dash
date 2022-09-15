$(function() {
  /* ChartJS
   * -------
   * Data and config for chartjs
   */
  'use strict';
  for (let i = 1; i <= 27; i++) {
    const labels = []
    var chartiddonut = "chartdonut" + i;
    for (let j = 1; j <= 24; j++) {
      var letter = String.fromCharCode(j + 64);
      labels.push(lable[i-1]+""+letter)
    }
    var doughnutPieData = {
      labels: labels,
      datasets: [{
        data: datachart[i-1],
        backgroundColor: ["rgb(52, 63, 1)", "rgb(51, 54, 58)", "rgb(14, 17, 16)", "rgb(145, 52, 77)", "rgb(22, 43, 15)", "rgb(158, 90, 133)", "rgb(43, 27, 41)", "rgb(57, 55, 79)", "rgb(229, 229, 232)", "rgb(174, 119, 214)", "rgb(211, 229, 237)", "rgb(25, 8, 13)", "rgb(80, 183, 149)", "rgb(12, 12, 15)", "rgb(132, 166, 206)", "rgb(35, 32, 34)", "rgb(8, 16, 56)", "rgb(24, 13, 61)", "rgb(126, 142, 153)", "rgb(208, 232, 104)", "rgb(18, 22, 58)", "rgb(226, 160, 83)", "rgb(242, 145, 176)", "rgb(163, 56, 175)"]
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
    if ($(`#donat${i}`).length) {
      var doughnutChartCanvas = $(`#donat${i}`).get(0).getContext("2d");
      window[chartiddonut] = new Chart(doughnutChartCanvas, {
        type: 'doughnut',
        data: doughnutPieData,
        options: doughnutPieOptions
      });
    }
  }

  const socket = io()
  window.onload = function(){
    socket.emit('interval-detail-ng', part, line)
  }

  socket.on('update-header', (total, ng, ok, dt, target) => {
    document.getElementById('headOK').innerHTML = ok || 0
    document.getElementById('headNG').innerHTML = ng || 0
    document.getElementById('headDT').innerHTML = dt
    document.getElementById('headTP').innerHTML = total || 0
    document.getElementById('target').innerHTML = target || 0
  })

  socket.on('update-val', (arrVal) => {
    for (let i = 1; i <= arrVal.length; i++) {
      window[`chartdonut${i}`].data.datasets[0].data = arrVal[i-1]
      window[`chartdonut${i}`].update()
      document.getElementById(`jml${i}`).innerHTML = arrVal[i-1].reduce((x, y) => x + y)
    }
  })
});
