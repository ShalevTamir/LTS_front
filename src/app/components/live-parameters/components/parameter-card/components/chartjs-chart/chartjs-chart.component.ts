import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import Chart, { ChartData, ChartTypeRegistry } from 'chart.js/auto';
import { ChartFactoryService } from '../../../../../../common/utils/chart-factory.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { ConfigChartType } from './models/config-chart-type.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { MenuStateHandler } from '../../../../../../common/services/menu-state-handler.service';

@Component({
  selector: 'app-chartjs-chart',
  standalone: true,
  imports: [NgIf, AsyncPipe],
  templateUrl: './chartjs-chart.component.html',
  styleUrl: './chartjs-chart.component.scss',
  providers: [ChartFactoryService],
  animations: [
    trigger('menuOpenClose', [
      state('open', style({
        height: '131px'
      })),
      state('closed', style({
        height: '168px'
      })),
      transition('open <=> closed', animate('0.5s ease'))
    ])
  ]
})
export class ChartjsChartComponent implements AfterViewInit, OnChanges{
  public static defaultChartType: ConfigChartType = ConfigChartType.Guage;
  public static chartsAmount: number = 0;
  @Input({required: true}) xAxisData!: string[]
  @Input({required: true}) yAxisData!: string[]
  isMenuOpen: Observable<boolean>; 
  noDataInserted!: boolean;
  // @ViewChild('canvasRef', { static: true }) canvasRef!: ElementRef;
  // @ViewChild('noDataRef', { static: true }) noDataRef!: ElementRef;


  chartId: string = "chart-element-"+ChartjsChartComponent.chartsAmount;
  chart: any;
  @Input() chartType: ConfigChartType = ChartjsChartComponent.defaultChartType;

  constructor(private _chartFactoryService: ChartFactoryService, menuStateHandler: MenuStateHandler)
  {
    ChartjsChartComponent.chartsAmount++;
    this.chartId = "chart-element-"+ChartjsChartComponent.chartsAmount;
    Chart.defaults.font.size = 14;
    Chart.defaults.color = "#9b9ca7";
    this.isMenuOpen = menuStateHandler.getMenuStates();
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
