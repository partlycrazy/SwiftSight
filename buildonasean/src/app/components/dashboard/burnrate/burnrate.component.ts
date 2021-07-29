import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';

@Component({
  selector: 'dashboard-burnrate',
  templateUrl: './burnrate.component.html',
  styleUrls: ['./burnrate.component.css']
})
export class BurnrateComponent implements OnInit, OnChanges {

  @Input() activeItem: Set<string>


  private lineChartDataOriginal: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Latex Glove (L)' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Medical Gown (Blue)' },
    { data: [180, 48, 77, 90, 100, 270, 120], label: 'Medical Gown (Yellow)' }
  ];

  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        }
      ]
    },
    annotation: { }
  };
  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor() { }

  ngOnInit(): void {
    this.lineChartLabels =this.generateDates(7);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("Burnrate Detect Change");
    this.lineChartData = [];
    this.lineChartDataOriginal.forEach(dataGroup => {      
      if (this.activeItem.has(dataGroup.label)) {
        this.lineChartData.push(dataGroup);
      }
    });
    console.log(changes.activeItem.currentValue);
    console.log(this.lineChartData.length);
  }

  ngOnDestroy() {
    this.lineChartData == [];
  }

  generateDates(amount: number): string[] {
    let dateArray: string[] = [];
   
    for (let i = 0; i < amount; i++) {
      let newDate = this.deltaDate(new Date(), -i, dateAmountType.DAYS);
      dateArray.push(newDate.toDateString());
    }
    return dateArray.reverse();
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
        return dt.setFullYear( dt.getFullYear() + amount) && dt;
    }
  }

  hideOne() {
    this.lineChartData.splice(1, 1);
    // this.chart.hideDataset(1, true);
  }
}

enum dateAmountType {
  DAYS,
  WEEKS,
  MONTHS,
  YEARS,
}
