$(function () {
  /* ChartJS
   * -------
   * Data and config for chartjs
   */
  'use strict';
  var date1;
  var date2;
  $("#export").click(function () {
    if (!month) {
      alert('Silahkan Pilih Bulan Terlebih Dahulu')
    } else { window.location = `/download?part=${part}&line=${line}&month=${month}` }
  });

  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  $('#filter').click(() => {
    if (!date1) {
      window.location = `/${line}/${part}`
    } else if (date1 && !date2) {
      window.location = `/${line}/${part}?date1=${date1}`
    } else {
      const d1 = date1.split('-')
      const d2 = date2.split('-')
      if (d1[1] > d2[1] && d1[0] == d2[0]) { alert('Terjadi Kesalahan Input Tanggal!') }
      else if (d1[1] == d2[1] && d1[2] > d2[2]) { alert('Terjadi Kesalahan Input Tanggal!') }
      else if (d1[0] > d2[0]) { alert('Terjadi Kesalahan Input Tanggal!') }
      else (window.location = `/${line}/${part}?date1=${date1}&date2=${date2}`)
    }
  })

  $("#datepick1").datepicker({
    beforeShow: function () {
      setTimeout(function () {
        $('.ui-datepicker').css('z-index', 99999999999999);
      }, 0);
    },
    onSelect: function () {
      date1 = formatDate($(this).datepicker('getDate'));
      console.log(formatDate(date1))
    }
  });

  $("#datepick2").datepicker({
    beforeShow: function () {
      setTimeout(function () {
        $('.ui-datepicker').css('z-index', 99999999999999);
      }, 0);
    },
    onSelect: function () {
      date2 = formatDate($(this).datepicker('getDate'));
      console.log(formatDate(date2))
    }
  });
  if (dateFilter && dateFilter2) {
    $('#datepick1').datepicker('setDate', new Date(dateFilter));
    $('#datepick2').datepicker('setDate', new Date(dateFilter2));
  }
  else if (dateFilter) {
    $('#datepick1').datepicker('setDate', new Date(dateFilter));
  }


  if ($("#performaneLine").length) {
    var graphGradient = document.getElementById("performaneLine").getContext('2d');
    var graphGradient2 = document.getElementById("performaneLine").getContext('2d');
    var graphGradient3 = document.getElementById("performaneLine").getContext('2d');
    var saleGradientBg = graphGradient.createLinearGradient(5, 0, 5, 50);
    saleGradientBg.addColorStop(0, 'rgba(52, 177, 170, 0.2)');
    saleGradientBg.addColorStop(1, 'rgba(52, 177, 170, 0.02)');
    var saleGradientBg2 = graphGradient2.createLinearGradient(5, 0, 5, 50);
    saleGradientBg2.addColorStop(0, 'rgba(255, 99, 132, 0.19)');
    saleGradientBg2.addColorStop(1, 'rgba(255, 99, 132, 0.09)');
    var saleGradientBg3 = graphGradient3.createLinearGradient(5, 0, 5, 50);
    saleGradientBg3.addColorStop(0, 'rgba(255, 175, 0, 0.19)');
    saleGradientBg3.addColorStop(1, 'rgba(255, 175, 0, 0.09)');
    var salesTopData = {
      labels: arrLable,
      datasets: [{
        label: 'OK',
        data: arrOK,
        backgroundColor: saleGradientBg,
        borderColor: [
          '#34B1AA',
        ],
        borderWidth: 1.5,
        fill: true, // 3: no fill
        pointBorderWidth: 1,
        pointRadius: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        pointHoverRadius: [2, 2, 2, 2, 2, 2, 2,],
        pointBackgroundColor: ['#34B1AA', '#34B1AA', '#34B1AA', '#34B1AA', '#34B1AA', '#34B1AA', '#34B1AA', '#34B1AA', '#34B1AA', '#34B1AA', '#34B1AA', '#34B1AA', '#34B1AA'],
        pointBorderColor: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff',],
      }, {
        label: 'NG',
        data: arrNG,
        backgroundColor: saleGradientBg2,
        borderColor: [
          '#ff6384',
        ],
        borderWidth: 1.5,
        fill: true, // 3: no fill
        pointBorderWidth: 1,
        pointRadius: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,],
        pointHoverRadius: [],
        pointBackgroundColor: ['#ff6384', '#ff6384', '#ff6384', '#ff6384', '#ff6384', '#ff6384', '#ff6384', '#ff6384', '#ff6384', '#ff6384', '#ff6384', '#ff6384', '#ff6384'],
        pointBorderColor: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff',],
      }
        , {
        label: 'DOWNTIME',
        data: arrDT,
        backgroundColor: saleGradientBg3,
        borderColor: [
          '#ffaf00',
        ],
        borderWidth: 1.5,
        fill: true, // 3: no fill
        pointBorderWidth: 1,
        pointRadius: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        pointHoverRadius: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        pointBackgroundColor: ['#ffaf00', '#ffaf00', '#ffaf00', '#ffaf00', '#ffaf00', '#ffaf00', '#ffaf00', '#ffaf00', '#ffaf00', '#ffaf00', '#ffaf00', '#ffaf00', '#ffaf00'],
        pointBorderColor: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff',],
      }
      ]
    };

    var salesTopOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          gridLines: {
            display: true,
            drawBorder: false,
            color: "#F0F0F0",
            zeroLineColor: '#F0F0F0',
          },
          ticks: {
            beginAtZero: false,
            autoSkip: true,
            maxTicksLimit: 4,
            fontSize: 10,
            color: "#6B778C"
          }
        }],
        xAxes: [{
          gridLines: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            beginAtZero: false,
            autoSkip: false,
            maxTicksLimit: 7,
            fontSize: 10,
            color: "#6B778C"
          }
        }],
      },
      legend: false,
      legendCallback: function (chart) {
        var text = [];
        text.push('<div class="chartjs-legend"><ul>');
        for (var i = 0; i < chart.data.datasets.length; i++) {
          console.log(chart.data.datasets[i]); // see what's inside the obj.
          text.push('<li>');
          text.push('<span style="background-color:' + chart.data.datasets[i].borderColor + '">' + '</span>');
          text.push(chart.data.datasets[i].label);
          text.push('</li>');
        }
        text.push('</ul></div>');
        return text.join("");
      },

      elements: {
        line: {
          tension: 0.4,
        }
      },
      tooltips: {
        backgroundColor: 'rgba(31, 59, 179, 1)',
      }
    }
    var salesTop = new Chart(graphGradient, {
      type: 'line',
      data: salesTopData,
      options: salesTopOptions
    });
    document.getElementById('performance-line-legend').innerHTML = salesTop.generateLegend();
  }
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
  const socket = io()

  if (!dateFilter) {
    socket.emit('interval-detail', part, line)
  }

  socket.on('disconnect')

  socket.on('update-chart-perc', (lable, ok, ng, dt) => {
    salesTop.data.datasets[0].data = ok
    salesTop.data.datasets[1].data = ng
    salesTop.data.datasets[2].data = dt
    salesTop.data.labels = lable
    salesTop.update()
  })

  socket.on('update-chart-ng', (val, lable) => {
    barChartNG.data.datasets[0].data = val
    barChartNG.update()
  })

  socket.on('update-chart-dt', (val) => {
    barChartDT.data.datasets[0].data = val
    barChartDT.update()
  })

  socket.on('update-header', (total, ng, ok, dt, target) => {
    document.getElementById('headOK').innerHTML = ok || 0
    document.getElementById('headNG').innerHTML = ng || 0
    document.getElementById('headDT').innerHTML = dt
    document.getElementById('headTP').innerHTML = total || 0
    document.getElementById('target').innerHTML = target || 0
  })
});