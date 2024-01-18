import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CardComponent } from './components/card/card.component';
import { HttpClientModule } from '@angular/common/http';
import { NgFor } from '@angular/common';
import { FilteredFrame } from './models/ros/filtered-frame.ros';
import { SocketHandlerService } from './services/socket-handler.service';
import { TelemetryParameter } from './models/ros/telemetry-parameter.ros';

@Component({
  selector: 'app-live-parameters',
  standalone: true,
  imports: [CardComponent, HttpClientModule, NgFor],
  templateUrl: './live-parameters.component.html',
  styleUrl: './live-parameters.component.scss',
  providers: [SocketHandlerService]
})
export class LiveParametersComponent implements OnInit{
  parameters: string[]
  @ViewChildren(CardComponent) cards!: QueryList<CardComponent>
  constructor(private _socketHandlerService: SocketHandlerService) {
    this.parameters = ["Altitude","Longitude","Wind_Speed"];
  }

  ngOnInit(): void {
    this._socketHandlerService.initWebSocket(this.parameters, this.updateAllCharts);
  }


  updateAllCharts = (filteredTeleFrame: FilteredFrame) => {
    this.cards.forEach(card => {
      let cardTeleParameter: TelemetryParameter | undefined = 
        filteredTeleFrame.Parameters.find(parameter => parameter.Name == card.parameterName);
      if (cardTeleParameter !== undefined){
        let date = new Date(0);
        date.setMilliseconds(filteredTeleFrame.TimeStamp);
        card.updateChartValues(date.toLocaleTimeString(), cardTeleParameter.Value);
      }
    });
  
  }

    
}
