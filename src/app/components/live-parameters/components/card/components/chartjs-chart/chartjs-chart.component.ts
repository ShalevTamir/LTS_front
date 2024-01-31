import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import Chart, { ChartData, ChartTypeRegistry } from 'chart.js/auto';
import { ChartFactoryService } from '../../../../../../common/utils/chart-factory.service';
import { NgIf } from '@angular/common';
import { ConfigChartType } from './models/config-chart-type.model';

@Component({
  selector: 'app-chartjs-chart',
  standalone: true,
  imports: [NgIf],
  templateUrl: './chartjs-chart.component.html',
  styleUrl: './chartjs-chart.component.scss',
  providers: [ChartFactoryService]
})
export class ChartjsChartComponent implements AfterViewInit, OnChanges{
  public static defaultChartType: ConfigChartType = ConfigChartType.Line;
  public static chartsAmount: number = 0;
  @Input({required: true}) xAxisData!: string[]
  @Input({required: true}) yAxisData!: string[]
  noDataInserted!: boolean;
  // @ViewChild('canvasRef', { static: true }) canvasRef!: ElementRef;
  // @ViewChild('noDataRef', { static: true }) noDataRef!: ElementRef;


  chartId: string = "chart-element-"+ChartjsChartComponent.chartsAmount;
  chart: any;
  @Input() chartType: ConfigChartType = ChartjsChartComponent.defaultChartType;

  constructor(private _chartFactoryService: ChartFactoryService)
  {
    ChartjsChartComponent.chartsAmount++;
    this.chartId = "chart-element-"+ChartjsChartComponent.chartsAmount;
    Chart.defaults.font.size = 14;
    Chart.defaults.color = "#9b9ca7";
  }
  
  ngAfterViewInit(){
    setTimeout(() => {
      if(this.chart === undefined)
      this.chart = this.createChart();
    }, 0);
  }

  ngOnChanges(){
    if (this.chart){
      this.chart.destroy();
      this.chart = this.createChart();
    }
  }	

  public insertData(xData: string, yData: string, replaceOldData: boolean){
    this.xAxisData.push(xData);
    this.yAxisData.push(yData);
    this.chart.update();

    if(replaceOldData){
      this.xAxisData.shift();
      this.yAxisData.shift();
      this.chart.update();
    }
  }

  private createChart(){
    return this._chartFactoryService.buildChart(
      this.chartId, 
      this.chartType,
      this.xAxisData,
      this.yAxisData
      );
  }
}
