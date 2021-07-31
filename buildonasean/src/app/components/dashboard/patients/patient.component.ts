import { BoundElementProperty } from '@angular/compiler';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Color, Label, MultiDataSet, SingleDataSet } from 'ng2-charts';
import { APIService } from 'src/app/core/http/api.service';


@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})

export class PatientComponent implements OnInit, AfterViewInit {

  @Input() hospital_id: number
  

  private lineChartDataOriginal: ChartDataSets[] = [];
  
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  private defaultOptions: (ChartOptions & { annotation: any}) ={
    responsive: true,
    maintainAspectRatio: false,
    annotation: {},
    legend: {
      labels: {
        filter: function (item, chart) {
          return false
        }
      }
    },
    elements: {
      center: {
        text: 'OldOccupancy',
        color: "black",
        fontStyle: "Roboto",
        lineHeight: 25,
        shiftY: 55
      }
    },
    title: {
      text: "Non-ICU Beds",
      display: true,
      fontStyle: "bold",
      fontSize: 22
    },
    tooltips: {
      filter: function (tooltip) {
        // console.log(tooltip);
        return true;
        // return tooltip.datasetIndex % 2 != 0;
      }
    },
    rotation: 1 * Math.PI,
    circumference: 1 * Math.PI
  };


  public nonICULabels: Label[] = ['Non-ICU Occupied', 'Non-ICU Available'];
  public nonICUData: SingleDataSet = [];
  public nonICUOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    maintainAspectRatio: false,
    annotation: {},
    rotation: 1 * Math.PI,
    circumference: 1 * Math.PI
  };

  public ICULabels: Label[] = ['ICU Occupied', 'ICU Available'];
  public ICUData: SingleDataSet = [];
  public ICUOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    maintainAspectRatio: false,
    annotation: {},
    rotation: 1 * Math.PI,
    circumference: 1 * Math.PI
  };

  public donutChartColor: Color[] = [
  {
    backgroundColor: ['red', 'green']
  }
  ]
  public chartType: ChartType = 'doughnut';

  public nonICUCount: number = 0;
  public nonICUBeds: number = 0;
  public ICUCount: number = 0;
  public ICUBeds: number = 0;
  

  constructor(private APIService: APIService) { }

  ngOnInit(): void {
    this.init();
  }

  async init() {
    let hospital: any = await this.APIService.getHospital(this.hospital_id).toPromise();
    this.nonICUBeds = hospital[0].max_patient_capacity;
    this.ICUBeds = hospital[0].max_icu_patient_capacity;

    let results: any = await this.APIService.getNonICUPatients(this.hospital_id).toPromise();
    this.nonICUCount = results[0].patients;
    this.nonICUData.push(this.nonICUCount);
    this.nonICUData.push(this.nonICUBeds - this.nonICUCount);

    let occupancyRate: any = this.nonICUCount / this.nonICUBeds * 100;
    let newOptions = this.defaultOptions
    newOptions.elements.center.text = parseFloat(occupancyRate).toFixed(2)+"%";
    this.nonICUOptions = newOptions;
    
    
    results = await this.APIService.getICUPatients(this.hospital_id).toPromise();
    this.ICUCount = results[0].patients;
    this.ICUData.push(this.ICUCount);
    this.ICUData.push(this.ICUBeds - this.ICUCount);
    occupancyRate = this.ICUCount / this.ICUBeds * 100;
    newOptions.elements.center.text = parseFloat(occupancyRate).toFixed(2)+"%";
    newOptions.title.text = "ICU Beds";
    this.ICUOptions = newOptions    
  }

  ngAfterViewInit() {  }



}

Chart.pluginService.register({
  afterDraw: function(chart) {
    if (chart.config.options.elements.center) {
      // Get ctx from string
      var ctx = chart.ctx;
      
      // Get options from the center object in options
      var centerConfig = chart.config.options.elements.center;
      var fontStyle = centerConfig.fontStyle || 'Arial';
      var txt = centerConfig.text;
      var color = centerConfig.color || '#000';
      var maxFontSize = centerConfig.maxFontSize || 75;
      var sidePadding = centerConfig.sidePadding || 20;
      var sidePaddingCalculated = (sidePadding / 100) * (chart.options.circumference * 2)
      // Start with a base font of 30px
      ctx.font = "30px " + fontStyle;

      // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      var stringWidth = ctx.measureText(txt).width;
      var elementWidth = (50 * 2) - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      var widthRatio = elementWidth / stringWidth;
      var newFontSize = Math.floor(30 * widthRatio);
      var elementHeight = (150 * 2);

      // Pick a new font size so it will not be larger than the height of label.
      var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
      var minFontSize = centerConfig.minFontSize;
      var lineHeight = centerConfig.lineHeight || 25;
      var wrapText = false;

      // if (minFontSize === undefined) {
      //   minFontSize = 20;
      // }

      // if (minFontSize && fontSizeToUse < minFontSize) {
      //   fontSizeToUse = minFontSize;
      //   wrapText = true;
      // }

      // Set font settings to draw it correctly.
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
      ctx.font = fontSizeToUse + "px " + fontStyle;
      ctx.fillStyle = color;

      var shiftX = centerConfig.shiftX || 0;
      var shiftY = centerConfig.shiftY || 0;

      if (!wrapText) {
        ctx.fillText(txt, centerX + shiftX, centerY + shiftY);
        return;
      }
    }
  }
});