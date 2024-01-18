import { AfterViewInit, Component, Input, OnChanges, OnInit } from '@angular/core';
import Chart, { ChartData, ChartTypeRegistry } from 'chart.js/auto';
import { ConfigChartType } from './models/config-chart-type.model';
import { isNullOrUndef } from 'chart.js/dist/helpers/helpers.core';
import { ChartFactoryService } from '../../../../../../common/utils/chart-factory.service';

@Component({
  selector: 'app-chartjs-chart',
  standalone: true,
  imports: [],
  templateUrl: './chartjs-chart.component.html',
  styleUrl: './chartjs-chart.component.scss',
  providers: [ChartFactoryService]
})
export class ChartjsChartComponent implements AfterViewInit, OnChanges{
  public static defaultChartType: ConfigChartType = ConfigChartType.Line;
  public static chartsAmount: number = 0;
  xAxisData: string[]
  yAxisData: string[]

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
  }
  
  ngAfterViewInit(){
    this.chart = this.createChart();
    // console.log(this.chart.data);
  }

  ngOnChanges(){
    if (this.chart){
      this.chart.destroy();
      this.chart = this.createChart();
    }
  }	

  public insertData(xData: string, yData: string){
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
