import { Component, OnInit } from '@angular/core';
import { CardComponent } from './components/card/card.component';
import { SocketHandlerService } from './services/socket-handler.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-live-parameters',
  standalone: true,
  imports: [CardComponent, HttpClientModule],
  templateUrl: './live-parameters.component.html',
  styleUrl: './live-parameters.component.scss',
  providers: [SocketHandlerService]
})
export class LiveParametersComponent implements OnInit{

  constructor(private _socketHandlerService: SocketHandlerService) {}

  ngOnInit(): void {
    this._socketHandlerService.initWebSocket(["first","second","third"]);
  }

    
}
