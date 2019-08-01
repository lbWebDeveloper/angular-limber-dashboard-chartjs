import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private sharesColor:string = "rgb(223, 163, 161)";
  private clicksColor:string="rgb(41, 128, 185)";
  private valuesColor:string="#777";

	private customTooltips = function(tooltip) {
			// Tooltip Element
			var tooltipEl = document.getElementById('chartjs-tooltip');
			if (!tooltipEl) {
				tooltipEl = document.createElement('div');
				tooltipEl.id = 'chartjs-tooltip';
				tooltipEl.innerHTML = '<table></table>';
				this._chart.canvas.parentNode.appendChild(tooltipEl);
			}
			// Hide if no tooltip
			if (tooltip.opacity === 0) {
				tooltipEl.style.opacity = 0;
				return;
			}
			// Set caret Position
			tooltipEl.classList.remove('above', 'below', 'no-transform');
			if (tooltip.yAlign) {
				tooltipEl.classList.add(tooltip.yAlign);
			} else {
				tooltipEl.classList.add('no-transform');
			}
			function getBody(bodyItem) {
				return bodyItem.lines;
			}
			// Set Text
			if (tooltip.body) {
				var titleLines = tooltip.title || [];
				var bodyLines = tooltip.body.map(getBody);
				var innerHtml = '<thead>';
				titleLines.forEach(function(title) {
					innerHtml += '<tr><th>' + title + '</th></tr>';
				});
				innerHtml += '</thead><tbody>';
				bodyLines.forEach(function(body, i) {
					var colors = tooltip.labelColors[i];
					var style = 'background:' + colors.backgroundColor;
					style += '; border-color:' + colors.borderColor;
					style += '; border-width: 2px';
					var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
					innerHtml += '<tr><td>' + span + body + '</td></tr>';
				});
				innerHtml += '</tbody>';
				var tableRoot = tooltipEl.querySelector('table');
				tableRoot.innerHTML = innerHtml;
			}
			var positionY = this._chart.canvas.offsetTop;
			var positionX = this._chart.canvas.offsetLeft;
			// Display, position, and set styles for font
			tooltipEl.style.opacity = 1;
			tooltipEl.style.left = positionX + tooltip.caretX + 'px';
			tooltipEl.style.top = positionY + tooltip.caretY + 'px';
			tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
			tooltipEl.style.fontSize = tooltip.bodyFontSize + 'px';
			tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
			tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
		};



  
  
  public barChartOptions: ChartOptions = {
    responsive: true,
    tooltips: {
        mode: 'x',
        intersect:false,
        position:'nearest',
        backgroundColor:'rgba(255, 255, 255, 0.9)',
        borderColor:'#CCC',
        borderWidth:1,
        titleFontColor:this.valuesColor,
        displayColors:false,
        caretSize:0,
        callbacks: {
            labelTextColor: (tooltipItem, chart) => {
              if(tooltipItem.datasetIndex ==1)
                return this.sharesColor;
              else
                return this.clicksColor;
            }
        }
    },
    layout: {
        padding: {
            left: 10,
            right: 0,
            top: 10,
            bottom: 0
        }
    },
    legend: {
        labels: {
            // This more specific font property overrides the global property
            fontColor: this.valuesColor,
            fontSize: 12         
        }
    },
    scales: {
        xAxes: [{
            position: "bottom",
            barPercentage: 1,
            minBarLength: 2,
            gridLines: {
                offsetGridLines: true,
                display: false
            },
            ticks: {
              fontColor: this.valuesColor, // this here
            }
        }],
        yAxes: [{
            gridLines: {
                offsetGridLines: true
            },
            scaleLabel: {
              display: false,
              labelString: "Time in Seconds",
              fontColor: "red"
            },
            ticks: {
              fontColor: this.valuesColor, // this here
            }
        }]
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  // Load chart data and styles
  public barChartData: ChartDataSets[] = [
    { 
        data: [1, 2, 3, 0, 10, 6, 5], 
        label: 'Clicks', 
        type: 'line',
        fill: false,
        pointBackgroundColor:this.clicksColor,
        pointBorderColor:this.clicksColor,
        pointHoverBorderWidth: 5        
    },
    /*{ data: [1, 2, 3], label: 'Accepted', stack: 'a' },
    { data: [1, 2, 3], label: 'Open', stack: 'a' },
    { data: [1, 2, 3], label: 'In Progress', stack: 'a' },*/
    {
        data: [1, 2, 3, 8, 3, 4, 12], 
        label: 'Shares', 
        type: 'bar', 
        borderColor: "rgb(223, 163, 161)",
        backgroundColor: "rgb(223, 163, 161)"    
    }
  ];

  public barChartColors: Color[] = [
    {
      backgroundColor: [
        this.clicksColor
      ],
      borderColor: [
        this.clicksColor
      ]
    }
  ];

  // Load labels, ex : time slots
  public barChartLabels: string[] = ['L', 'M', 'M', 'J', 'Vendredi', 'S', 'D'];

  constructor() { }

  ngOnInit() {
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
      //console.log(active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    //console.log(event, active);
  }

  public randomize(): void {
    // Only Change 3 values
    const data = [
      Math.round(Math.random() * 10),
      5,
      8,
      (Math.random() * 10),
      6,
      (Math.random() * 10),
      4];
    const clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;
    /**
     * (My guess), for Angular to recognize the change in the dataset
     * it has to change the dataset variable directly,
     * so one way around it, is to clone the data, change it and then
     * assign it;
     */
  }
}
