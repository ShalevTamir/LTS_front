import { Injectable } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, ChartTypeRegistry } from 'chart.js/auto';
import { ConfigChartType } from '../../components/live-parameters/components/card/chartjs-chart/models/config-chart-type.model';

@Injectable({
  providedIn: 'root'
})
export class ChartFactoryService {

  constructor() { }

  generateChartData(){
    let xAxisData = ['15:30', '15:31', '15:32','15:33',
    '15:34', '15:35', '15:36','15:37'];
    let yAxisData = ['467','-500', '572', '79', '92',
    '574', '573', '576'];

    return [xAxisData, yAxisData];
  }

  generateChartConfig(chartType: ConfigChartType, xAxisData: string[], yAxisData: string[]){
    let options = {
      aspectRatio:2.5,
      plugins:{
        legend: {
          display: false,
        }
      },
      scales: {
        y: {
          ticks: {
            padding: 7 // Add 10px padding around each label
          }
        }
      }
    }

    switch(chartType){
      case ConfigChartType.Stepped:

        return  {
          type:'line' as ChartType,
          data: {
            labels: xAxisData, 
            datasets: [
              {
                data: yAxisData,
                stepped: true
              }
            ]
          },
          options: options
        }
      case ConfigChartType.Bar:
        return {
          type:'bar' as ChartType,
          data: {
            labels: xAxisData, 
            datasets: [
              {
                data: yAxisData,
              }
            ]
          },
          options: options
        }
        default:
        case ConfigChartType.Line:
          return  {
            type:'line' as ChartType,
            data: {
              labels: xAxisData, 
               datasets: [
                {
                  data: yAxisData,
                  fill: 'origin',
                  tension: 0.4
                }
              ]
            },
            options: options
          }
        }
    
  }

  buildChart(elementName: string, chartType: ConfigChartType, xAxisData: string[], yAxisData: string[]){
    return new Chart(
      elementName,
      this.generateChartConfig(chartType, xAxisData, yAxisData)
      )
  }
}
