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
  xAxisData: string[]
  yAxisData: string[]
  noDataInserted!: boolean;
  @ViewChild('canvasRef', { static: true }) canvasRef!: ElementRef;
  @ViewChild('noDataRef', { static: true }) noDataRef!: ElementRef;


  chartId: string = "chart-element-"+ChartjsChartComponent.chartsAmount;
  chart: any;
  @Input() chartType: ConfigChartType = ChartjsChartComponent.defaultChartType;

  constructor(private _chartFactoryService: ChartFactoryService)
  {
    ChartjsChartComponent.chartsAmount++;
    this.chartId = "chart-element-"+ChartjsChartComponent.chartsAmount;
    Chart.defaults.font.size = 14;
    Chart.defaults.color = "#9b9ca7";
    this.xAxisData = []
    this.yAxisData = []
    this.noDataInserted = true;
  }
  
  ngAfterViewInit(){
    this.noDataRef.nativeElement.style.display="block";
    this.canvasRef.nativeElement.style.display="none";
    this.chart = this.createChart();
  }

  ngOnChanges(){
    if (this.chart){
      this.chart.destroy();
      this.chart = this.createChart();
      this.canvasRef.nativeElement.style.display="block";
    }
  }	

  public insertData(xData: string, yData: string){
    if(this.noDataInserted){
      this.noDataRef.nativeElement.style.display="none";
      this.canvasRef.nativeElement.style.display="block";
      this.noDataInserted = !this.noDataInserted;
    }
    this.chart.data.labels.push(xData);
    this.chart.data.datasets[0].data.push(yData);
    this.chart.update();
  }

  private createChart(){
    // let [xAxisData, yAxisData] = this._chartFactoryService.generateChartData();
    return this._chartFactoryService.buildChart(
      this.chartId, 
      this.chartType,
      this.xAxisData,
      this.yAxisData
      );
  }
}
