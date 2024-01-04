import { Component, Input, OnInit } from '@angular/core';
import Chart, { ChartData, ChartTypeRegistry } from 'chart.js/auto';
import { ChartFactoryService } from '../../../../../common/utils/chart-factory.service';
import { ConfigChartType } from './models/config-chart-type.model';
import { isNullOrUndef } from 'chart.js/dist/helpers/helpers.core';

@Component({
  selector: 'app-chartjs-chart',
  standalone: true,
  imports: [],
  templateUrl: './chartjs-chart.component.html',
  styleUrl: './chartjs-chart.component.scss',
  providers: [ChartFactoryService]
})
export class ChartjsChartComponent implements OnInit{
  public static defaultChartType: ConfigChartType = ConfigChartType.Bar;

  chart: any;
  @Input() chartType: string = ChartjsChartComponent.defaultChartType.toString();

  constructor(private _chartFactoryService: ChartFactoryService){}

  ngOnInit(){
    Chart.defaults.font.size = 14;
    Chart.defaults.color = "#9b9ca7";
    this.chart = this.createChart();
  }

  ngOnChanges(){
    if (this.chart){
      this.chart.destroy();
      this.chart = this.createChart();
    }
  }	

  createChart(){
    let [xAxisData, yAxisData] = this._chartFactoryService.generateChartData();
    return this._chartFactoryService.buildChart(
      "chart-element", 
      ConfigChartType[this.chartType as keyof typeof ConfigChartType],
      xAxisData,
      yAxisData
      );
  }
}
