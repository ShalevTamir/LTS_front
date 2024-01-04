import { Component } from '@angular/core';
import { ChartjsChartComponent } from './chartjs-chart/chartjs-chart.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { ConfigChartType } from './chartjs-chart/models/config-chart-type.model';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [ChartjsChartComponent, MatMenuModule, MatButtonModule, MatIconModule, NgFor],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
    parameterName: string = "Parameter Name";
    chartTypes: string[] = Object.keys(ConfigChartType).filter(value => isNaN(Number(value)))
    selectedChartType: string = ChartjsChartComponent.defaultChartType.toString();

    changeChartType(updatedChartType: string){
      this.selectedChartType = updatedChartType;
    }
}
