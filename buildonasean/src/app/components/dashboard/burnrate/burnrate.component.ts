import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
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

  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
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
        // console.log(tooltip);
        return true;
        // return tooltip.datasetIndex % 2 != 0;
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
  }

  renderChart() {
    this.lineChartData = [];
    this.lineChartDataOriginal.forEach(dataGroup => {
      if (this.activeItem.has(dataGroup.label)) {
        // if (dataGroup.label === "Latex Gloves (M)") {
        //   console.log("Adding Prediction");
        //   let newArray = new Array(10);
        //   newArray.push(7)
        //   console.log(newArray);
        //   this.lineChartData.push(this.lineChartDataPrediction[0]);
        //   console.log(this.lineChartDataPrediction[0]);
        // }

        if (dataGroup.label === "Latex Gloves (M)") {
          let predDataArray = new Array(dataGroup.data.length - 1);
          predDataArray.push(dataGroup.data[dataGroup.data.length - 1]);
          predDataArray.push(2032)
          predDataArray.push(1074)
          predDataArray.push(1532)
          let predChartData = {
            data: predDataArray, borderDash: [5, 10], pointBackgroundColor: "transparent", label: "remove", borderColor: "red"
          }
          this.lineChartData.push(predChartData);
        }
        this.lineChartData.push(dataGroup);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
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
