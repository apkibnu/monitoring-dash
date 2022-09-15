(function($) {
  'use strict';
  $(function() {
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
              pointRadius: [4, 4, 4, 4, 4,4, 4, 4, 4, 4,4, 4, 4],
              pointHoverRadius: [2,2,2,2,2,2,2,],
              pointBackgroundColor: ['#34B1AA', '#34B1AA', '#34B1AA', '#34B1AA', '#34B1AA', '#34B1AA', '#34B1AA', '#34B1AA', '#34B1AA', '#34B1AA', '#34B1AA', '#34B1AA', '#34B1AA'],
              pointBorderColor: ['#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff',],
          },{
            label: 'NG',
            data: arrNG,
            backgroundColor: saleGradientBg2,
            borderColor: [
                '#ff6384',
            ],
            borderWidth: 1.5,
            fill: true, // 3: no fill
            pointBorderWidth: 1,
            pointRadius: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, ],
            pointHoverRadius: [],
            pointBackgroundColor: ['#ff6384', '#ff6384', '#ff6384', '#ff6384','#ff6384', '#ff6384', '#ff6384', '#ff6384','#ff6384', '#ff6384', '#ff6384', '#ff6384','#ff6384'],
              pointBorderColor: ['#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff',],
        }
        ,{
          label: 'DOWNTIME',
          data: arrDT,
          backgroundColor: saleGradientBg3,
          borderColor: [
              '#ffaf00',
          ],
          borderWidth: 1.5,
          fill: true, // 3: no fill
          pointBorderWidth: 1,
          pointRadius: [4, 4, 4, 4, 4,4, 4, 4, 4, 4,4, 4, 4],
          pointHoverRadius: [2, 2, 2, 2, 2,2, 2, 2, 2, 2,2, 2, 2],
          pointBackgroundColor: ['#ffaf00', '#ffaf00', '#ffaf00', '#ffaf00','#ffaf00','#ffaf00','#ffaf00','#ffaf00','#ffaf00', '#ffaf00','#ffaf00','#ffaf00','#ffaf00'],
          pointBorderColor: ['#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff',],
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
                      color:"#F0F0F0",
                      zeroLineColor: '#F0F0F0',
                  },
                  ticks: {
                    beginAtZero: false,
                    autoSkip: true,
                    maxTicksLimit: 4,
                    fontSize: 10,
                    color:"#6B778C"
                  }
              }],
              xAxes: [{
                gridLines: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                  beginAtZero: false,
                  autoSkip: true,
                  maxTicksLimit: 7,
                  fontSize: 10,
                  color:"#6B778C"
                }
            }],
          },
          legend:false,
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
    const socket = io()
    window.onload = function(){
      socket.emit('interval-detail', part, line)
    }
    socket.on('update-chart-perc', (lable, ok, ng, dt) => {
      salesTop.data.datasets[0].data = ok
      salesTop.data.datasets[1].data = ng
      salesTop.data.datasets[2].data = dt
      salesTop.data.labels = lable
      salesTop.update()
    })
  });
})(jQuery);