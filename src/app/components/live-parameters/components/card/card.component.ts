import { Component } from '@angular/core';
import { ChartjsChartComponent } from './chartjs-chart/chartjs-chart.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { ConfigChartType } from './chartjs-chart/models/config-chart-type.model';
import { NgFor, NgIf } from '@angular/common';
import { GaugeChartComponent } from './gauge-chart/gauge-chart.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [ChartjsChartComponent, MatMenuModule, MatButtonModule, MatIconModule, NgFor, NgIf, GaugeChartComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
    parameterName: string = "Parameter Name";
    chartTypes: string[] = Object.keys(ConfigChartType).filter(value => isNaN(Number(value)))
    selectedChartType: ConfigChartType = ChartjsChartComponent.defaultChartType;
    selectedGaugeChart: boolean = false;

    changeChartType(updatedChartType: string){
      this.selectedChartType = ConfigChartType[updatedChartType as keyof typeof ConfigChartType];
      this.selectedGaugeChart = this.selectedChartType == ConfigChartType.Guage;
    }
}
