import { Component } from '@angular/core';
import { ChartjsChartComponent } from './chartjs-chart/chartjs-chart.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [ChartjsChartComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
    parameterName: string = "Parameter Name";
}
