import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
    @Input() parameterName: string = "Parameter Name";
    @Input() cardType: string = "chart";
    @ViewChild(ChartjsChartComponent) chartjs: ChartjsChartComponent | undefined;
    @ViewChild(GaugeChartComponent) gauge: GaugeChartComponent | undefined;
    // @ViewChild('chartContainerRef', { static: true }) chartContainerRef!: ElementRef;
    // @ViewChild('noDataRef', { static: true }) noDataRef!: ElementRef;
    chartTypes: string[] = Object.keys(ConfigChartType).filter(value => isNaN(Number(value)))
    selectedChartType: ConfigChartType = ChartjsChartComponent.defaultChartType;
    selectedGaugeChart: boolean = false;
    firstFrameReceived: boolean = false;
    chartMode: ChartMode = ChartMode.NO_DATA;
    xAxisData: string[] = []
    yAxisData: string[] = []
  constructor(){
    console.log(this.chartMode.toString());
  }

    changeChartType(updatedChartType: string){
      this.selectedChartType = ConfigChartType[updatedChartType as keyof typeof ConfigChartType];
      this.selectedGaugeChart = this.selectedChartType == ConfigChartType.Guage;
    }

    public updateChartValues(xData: string, yData: string){
      if(this.chartjs !== undefined){
        this.chartjs.insertData(xData,yData);
      }
      else if(this.gauge !== undefined){
        this.gauge.gaugeValue = +yData;
      }
      else{
        return;
      }
      this.chartMode = ChartMode.HAS_DATA;
    }

}
