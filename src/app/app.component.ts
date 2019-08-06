import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import moment = require('moment');

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public daterange: any = {};

  // see original project for full list of options
  // can also be setup using the config service to apply to multiple pickers
  public options: any = {
      locale: { format: 'YYYY-MM-DD' },
      alwaysShowCalendars: false,
      ranges: {
           'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      }
  };

  public selectedDate(value: any, datepicker?: any) {
      // any object can be passed to the selected event and it will be passed back here
      datepicker.start = value.start;
      datepicker.end = value.end;

      // or manupulat your own internal property
      this.daterange.start = value.start;
      this.daterange.end = value.end;
      this.daterange.label = value.label;
      this.randomize();
  }

  private sharesColor:string = "rgb(223, 163, 161)";
  private clicksColor:string="rgb(41, 128, 185)";
  private valuesColor:string="#777";

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
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        }
    },
    legend: {
        labels: {
            // This more specific font property overrides the global property
            fontColor: this.valuesColor,
            fontSize: 12         
        },
        display:false
    },
    scales: {
        xAxes: [{
            position: "bottom",
            barPercentage: 0.9,
            gridLines: {
                offsetGridLines: true,
                display: false
            },
            ticks: {
              fontColor: this.valuesColor,
              callback: function(value, index, values) {
                  //if(index%2 == 0)
                    return value;
                  //return undefined;
               },
               autoSkip: true,
               maxRotation: 0,
               minRotation: 0
            }
        }],
        yAxes: [{
            gridLines: {
                offsetGridLines: true
            },
          type:'linear',
          id:'left-axis',
          scaleLabel: {
            display: false, labelString: 'Clicks',
            labelColor : this.clicksColor

          },
          display: true,
          ticks: {
              fontColor: this.valuesColor
            }
        },{
          type:'linear',
          id:'right-axis',
          display: true,
          position: 'right',
          stacked:false,
          scaleLabel: {
            display: false, 
            labelString: 'Partages',
            labelColor : this.sharesColor},
          gridLines: {drawOnChartArea:false},
          ticks: {
              fontColor: this.valuesColor
              
            }
        }]
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  // Load chart data and styles
  public barChartData: ChartDataSets[] = [
    { 
        data: [1, 200, 3, 10, 10, 6, 5, 20], 
        label: 'Clicks', 
        type: 'line',
        fill: false,
        pointBackgroundColor:this.clicksColor,
        pointBorderColor:this.clicksColor,
        pointHoverBorderWidth: 5,
        yAxisID: 'left-axis'
    },
    /*{ data: [1, 2, 3], label: 'Accepted', stack: 'a' },
    { data: [1, 2, 3], label: 'Open', stack: 'a' },
    { data: [1, 2, 3], label: 'In Progress', stack: 'a' },*/
    {
        data: [1, 2, 3, 8, 3, 4, 12,15], 
        label: 'Shares', 
        type: 'bar', 
        borderColor: "rgb(223, 163, 161)",
        backgroundColor: "rgb(223, 163, 161)",
        yAxisID: 'right-axis'    
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
  public barChartLabels: string[] = ['LLLLLLLL', 'MMMMMMM', 'MMMMMMM', 'JJJJJJ', 'Vendredi', 'DDDDDDDD','LLLLLLL',];

  constructor() { 
    
  }

  ngOnInit() {
    /*Chart.pluginService.register({
      afterDraw: function (chart) {
        return;
        if (chart.config.options.scales.yAxes) {
          //Get ctx from string
          var ctx = chart.chart.ctx;

          var config = chart.config.options.scales.yAxes;
          var txt = config[0].scaleLabel.labelString;
          var txt2 = config[1].scaleLabel.labelString;
          var color = config[0].scaleLabel.labelColor || '#000';
          var color2 = config[1].scaleLabel.labelColor || '#000';

          var positionX1 = chart.chartArea.left + 10;
          var positionX2 = chart.chartArea.right - 50;
          var positionY1 = (chart.chartArea.top - 10);
          ctx.font = "12px Arial";

          ctx.fillStyle = color;
          ctx.fillText(txt, positionX1, positionY1);

          ctx.fillStyle = color2;
          ctx.fillText(txt2, positionX2, positionY1);
        }
      }
    });  
    */
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    if(!active)
      return;

    if(active.length <2)
      return;

    var pointClick = active[0];
    var pointShare = active[1];
    var chart = pointClick["_chart"];
    if(!chart)
      return;
    var clickValue = chart.data.datasets[pointClick["_datasetIndex"]].data[pointClick["_index"]];
    var shareValue = chart.data.datasets[pointShare["_datasetIndex"]].data[pointShare["_index"]];
    
    console.log("Click value: ", clickValue,"Share value: ", shareValue);
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
