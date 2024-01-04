import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { ChartFactoryService } from '../../../../../common/utils/chart-factory.service';

@Component({
  selector: 'app-chartjs-chart',
  standalone: true,
  imports: [],
  templateUrl: './chartjs-chart.component.html',
  styleUrl: './chartjs-chart.component.scss',
  providers: [ChartFactoryService]
})
export class ChartjsChartComponent implements OnInit{
  chart: any;
  chartType: string = 'bar'

  constructor(private _chartFactoryService: ChartFactoryService){}

  ngOnInit(){
    Chart.defaults.font.size = 14;
    Chart.defaults.color = "#9b9ca7";
    this.createChart();
  }

  



  createChart(){
    let [xAxisData, yAxisData] = this._chartFactoryService.generateChartData();

    this.chart = this._chartFactoryService.buildChart("chart-element", this.chartType, xAxisData, yAxisData);
  }
}
