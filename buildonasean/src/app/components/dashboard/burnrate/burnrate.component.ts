import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { APIService } from 'src/app/core/http/api.service';

@Component({
  selector: 'dashboard-burnrate',
  templateUrl: './burnrate.component.html',
  styleUrls: ['./burnrate.component.css']
})
export class BurnrateComponent implements OnInit, OnChanges {
  

  @Input() activeItem: Set<string>
  @Input() hospital_id: number


  private lineChartDataOriginal: ChartDataSets[] = [];

  private burnrateData: Burnrate[] = []

  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'darkgrey'
        },
        ticks: {
          fontColor: 'black'
        }
      }],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
          ticks: {
            fontColor: 'black',
            beginAtZero: true
          },
          gridLines: {
            color: 'darkgrey'
          }
        }
      ]
    },
    elements: {
      point: {
        radius: 4
      }
    },
    annotation: {},
    legend: {
      labels: {
        filter: function (item, chart) {
          return !(item.text === "remove")
        }
      }
    },
    tooltips: {
      filter: function (tooltip) {
        return tooltip.datasetIndex % 2 != 1;
      }
    }
  };
  public lineChartColors: Color[] = [
    { // orange
      // backgroundColor: 'rgba(148,159,177,0.2)',
      backgroundColor: 'transparent',
      borderColor: 'rgba(219,120,52, 1)',
      pointBackgroundColor: 'rgba(219,120,52, 1)',
      pointBorderColor: 'rgba(219,120,52, 1)',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(219,120,52, 1)'
    },
    { // purple
      // backgroundColor: 'rgba(77,83,96,0.2)',
      backgroundColor: 'transparent',
      borderColor: 'rgba(114, 93, 132, 1)',
      pointBackgroundColor: 'rgba(114, 93, 132, 1)',
      pointBorderColor: 'rgba(114, 93, 132, 1)',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(114, 93, 132, 1)'
    },
    { // lime
      // backgroundColor: 'rgba(255,0,0,0.3)',
      backgroundColor: 'transparent',
      borderColor: 'rgba(162,193,1, 1)',
      pointBackgroundColor: 'rgba(162,193,1, 1)',
      pointBorderColor: 'rgba(162,193,1, 1)',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(162,193,1, 1)'
    },
    { // blue
      backgroundColor: 'transparent',
      borderColor: 'rgba(23,158,224, 1)',
      pointBackgroundColor: 'rgba(23,158,224, 1)',
      pointBorderColor: 'rgba(23,158,224, 1)',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(23,158,224, 1)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  dataLoaded: boolean = false;

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor(private APIService: APIService) { }

  ngOnInit(): void {
    this.fetchChartData();
    this.fetchBurnrate();
  }

  async fetchBurnrate() {
    let results = await this.APIService.getDaysLeft(this.hospital_id).toPromise();
    
    for (let i = 0; i < results.length; i++) {
      let newBurnrate: Burnrate = {
        category_name: results[i].category_title,
        days_left: results[i].daysleft
      }
      this.burnrateData.push(newBurnrate);
    }



  }

  renderChart() {
    this.lineChartData = [];
    let colorCount = 0;
    for (let i = 0; i < this.lineChartDataOriginal.length; i++) {
      let dataGroup = this.lineChartDataOriginal[i];
      if (this.activeItem.has(dataGroup.label)) {

        let dataGroupChartData = {
          data: dataGroup.data,
          label: dataGroup.label,
          backgroundColor: 'transparent',
          borderColor: this.lineChartColors[colorCount].borderColor,
          pointBackgroundColor: this.lineChartColors[colorCount].pointBackgroundColor,
          pointBorderColor: this.lineChartColors[colorCount].pointBorderColor,
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: this.lineChartColors[colorCount].pointHoverBorderColor
        }

        this.lineChartData.push(dataGroupChartData);
        let predDataArray = new Array(dataGroup.data.length - 1);
        let currentQty: any = dataGroup.data[dataGroup.data.length - 1];
        predDataArray.push(currentQty);

        let daysLeft = this.burnrateData.find((item) => item.category_name === dataGroup.label).days_left;
        let delta = currentQty / daysLeft;

        for (let i = 0; i < 7; i++) {
          currentQty -= delta;
          predDataArray.push(currentQty)
        }

        let predChartData = {
          data: predDataArray, borderDash: [5, 8], 
          label: "remove",
          pointBackgroundColor: "transparent", 
          backgroundColor: 'transparent',
          pointBorderColor: 'transparent', 
          pointRadius: 0,
          borderColor: this.lineChartColors[colorCount].borderColor
        }
        this.lineChartData.push(predChartData);
        colorCount = colorCount == 3 ? 0 : colorCount+1;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.renderChart();
  }

  ngOnDestroy() {
    this.lineChartData == [];
  }

  async fetchChartData() {
    let result = await this.APIService.getChartData(this.hospital_id, 7).toPromise();
    let chartData: any[] = []
    result.forEach((res) => {
      let exist = chartData.filter((e: any) => e.label === res.category_title);
      if (exist.length == 0) {
        let newChartData: any = {
          data: [{ order_id: res.order_id, datetime: res.datetime, value: res.total }], label: res.category_title, backgroundColor: 'transparent'
        }
        chartData.push(newChartData);
      } else {
        // if (exist[0].data.length == 14) {
        //   return;
        // }

        let sameDate = exist[0].data.filter((e: any) => this.checkSameDay(e.datetime, res.datetime))
        if (sameDate.length == 0) {
          exist[0].data.push({
            order_id: res.order_id,
            datetime: res.datetime,
            value: res.total
          });
        } else {
          if (exist[0].data.order_id < res.order_id) {
            exist[0].data.order_id = res.order_id
            exist[0].data.value = res.total;
          }
        }
      }
    })
    chartData[0].data.forEach((d: any) => {
      let dateLabel = new Date(d.datetime)
      this.lineChartLabels.push(dateLabel.toDateString());
    })

    this.lineChartLabels = this.lineChartLabels.concat(this.generateDates(new Date('2020-08-08 04:00:00'), 7))


    chartData.forEach(cData => {
      cData.data = cData.data.map((o: any) => o.value);
    })
    this.lineChartDataOriginal = chartData;
    this.dataLoaded = true;
    this.renderChart();
  }

  generateDates(start: Date, amount: number): string[] {
    let dateArray: string[] = [];
    for (let i = 0; i < amount; i++) {
      let newDate = this.deltaDate(start, i, dateAmountType.DAYS);
      dateArray.push(newDate.toDateString());
    }
    return dateArray;
  }

  deltaDate(dt: Date, amount: number, dateType: dateAmountType): Date {
    switch (dateType) {
      case dateAmountType.DAYS:
        return dt.setDate(dt.getDate() + amount) && dt;
      case dateAmountType.WEEKS:
        return dt.setDate(dt.getDate() + (7 * amount)) && dt;
      case dateAmountType.MONTHS:
        return dt.setMonth(dt.getMonth() + amount) && dt;
      case dateAmountType.YEARS:
        return dt.setFullYear(dt.getFullYear() + amount) && dt;
    }
  }

  checkSameDay(date1: string, date2: string) {
    let d1 = new Date(date1)
    let d2 = new Date(date2)
    return d1.getDate() === d2.getDate() && Math.abs(d1.getTime() - d2.getTime())<24*60*60*1000;
  }

}

enum dateAmountType {
  DAYS,
  WEEKS,
  MONTHS,
  YEARS,
}

interface Burnrate {
  category_name: string,
  days_left: number
}