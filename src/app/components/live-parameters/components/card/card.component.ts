import { Component } from '@angular/core';
import { ChartjsChartComponent } from './chartjs-chart/chartjs-chart.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-card',
  standalone: true,
  imports: [ChartjsChartComponent, MatMenuModule, MatButtonModule, MatIconModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
    parameterName: string = "Parameter Name";
}
