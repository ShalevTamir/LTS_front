import { Component, OnInit } from '@angular/core';
import { CardComponent } from './components/card/card.component';
import { SocketHandlerService } from './services/socket-handler.service';
import { HttpClientModule } from '@angular/common/http';
import { NgFor } from '@angular/common';

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
  constructor(private _socketHandlerService: SocketHandlerService) {
    this.parameters = ["Altitude","Longitude","Wind_Speed"];
  }

  ngOnInit(): void {
    this._socketHandlerService.initWebSocket(this.parameters);
  }

    
}
