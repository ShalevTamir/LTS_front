import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { firstValueFrom } from 'rxjs';
import { ParametersListDto } from '../models/dtos/parameters-list.dto';
import { ClientConnectionId } from '../models/ros/client-connection-id.ros';
import { FilteredFrame } from '../models/ros/filtered-frame.ros';
import { SocketHandlerService } from '../../../common/utils/socket-connection/socket-handler.service';

@Injectable({
  providedIn: 'root'
})
export class LiveParametersSocketService {
  private _connection: HubConnection | undefined;
  private _clientId: string | undefined;
  private readonly SERVER_URL: string = "https://localhost:5003";

  constructor(private _httpClient: HttpClient, private _socketHandler: SocketHandlerService) { }

  public async initWebSocket(parametersToConfig: string[], processParameters: (filteredTeleFrame: FilteredFrame) => void){
    this._clientId = await this.retrieveClientId(parametersToConfig)
    this._connection = await this._socketHandler.initWebSocket(this.SERVER_URL+"/live-parameters-socket", [
      {
        listenerName: 'receiveParameters',
        callback: processParameters
      }
    ])
    await this.startParametersTransfer();
  }

  private async retrieveClientId(parametersToConfig: string[]): Promise<string>{
    let reqRes = this._httpClient.post<ClientConnectionId>(this.SERVER_URL+"/socket-config",new ParametersListDto(parametersToConfig));
    let connectionIdRos: ClientConnectionId = await firstValueFrom(reqRes);
    return connectionIdRos.ConnectionId;
  }

  private async startParametersTransfer(){
    await this._connection?.invoke("StartTransfer", this._clientId);
  }
}
