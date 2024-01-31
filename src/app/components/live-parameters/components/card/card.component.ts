import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';
import { ChartjsChartComponent } from './components/chartjs-chart/chartjs-chart.component';
import { ConfigChartType } from './components/chartjs-chart/models/config-chart-type.model';
import { GaugeChartComponent } from './components/gauge-chart/gauge-chart.component';
import { ChartMode } from './components/chartjs-chart/models/enums/chart-mode';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, MatIconModule, NgFor, NgIf, GaugeChartComponent, MatIconModule, ChartjsChartComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})

export class CardComponent {
  static readonly maxChartSamples: number = 60;
  @Input() parameterName: string = "Parameter Name";
  @Input() cardType: string = "chart";
  @ViewChild(ChartjsChartComponent) chartjs: ChartjsChartComponent | undefined;
  @ViewChild(GaugeChartComponent) gauge: GaugeChartComponent | undefined;
  chartTypes: string[] = Object.keys(ConfigChartType).filter(value => isNaN(Number(value)))
  selectedChartType: ConfigChartType = ChartjsChartComponent.defaultChartType;
  chartMode: ChartMode = ChartMode.NO_DATA;
  xAxisData: string[] = []
  yAxisData: string[] = []

  constructor(){
  }

  
  changeChartType(updatedChartType: string){
    this.selectedChartType = ConfigChartType[updatedChartType as keyof typeof ConfigChartType];
 }
 

  private insertChartjsData(xData: string, yData:string){
    this.xAxisData.push(xData);
    this.yAxisData.push(yData);
    this.chartjs?.chart.update();
    if(this.xAxisData.length > CardComponent.maxChartSamples){
      this.xAxisData.shift();
      this.yAxisData.shift();
      this.chartjs?.chart.update();
    }
  }

  public updateChartValues(xData: string, yData: string){
    this.chartMode = ChartMode.HAS_DATA;
    setTimeout(() => {
      this.insertChartjsData(xData, yData);      
      if(this.gauge !== undefined){
        this.gauge.updateGaugeValue(+yData);
      }
    }, 1);
    
  }
}
