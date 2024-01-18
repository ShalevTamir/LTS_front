import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { firstValueFrom } from 'rxjs';
import { ClientConnectionId } from '../models/ros/client-connection-id.ros';
import { ParametersListDto } from '../models/dtos/parameters-list.dto';
import { FilteredFrame } from '../models/ros/filtered-frame.ros';

@Injectable({
  providedIn: 'root'
})
export class SocketHandlerService {
  private _connection: HubConnection | undefined;
  private _clientId: string | undefined;
  private readonly SERVER_URL: string = "https://localhost:5003";

  constructor(private httpClient: HttpClient) { }

  async initWebSocket(parametersToConfig: string[], processParameters: (filteredTeleFrame: FilteredFrame) => void){
    this._clientId = await this.retrieveClientId(parametersToConfig)
    await this.initConnection(processParameters);
    await this.startParametersTransfer();
  }

  private async initConnection(processParameters: (filteredTeleFrame: FilteredFrame) => void){
    this._connection = new HubConnectionBuilder()
      .withUrl(this.SERVER_URL+"/live-parameters-socket")
      .build();

    this._connection.on('receiveParameters', (filteredTeleFrame: FilteredFrame) => {
     
      processParameters(filteredTeleFrame);
    });

    this._connection.on('connectionStatus', (isConnectionSuccessful: boolean) =>{
      console.log(isConnectionSuccessful);
    });
    
    await this._connection.start();
  }

  private async retrieveClientId(parametersToConfig: string[]): Promise<string>{
    let reqRes = this.httpClient.post<ClientConnectionId>(this.SERVER_URL+"/socket-config",new ParametersListDto(parametersToConfig));
    let connectionIdRos: ClientConnectionId = await firstValueFrom(reqRes);
    return connectionIdRos.ConnectionId;
  }

  private async startParametersTransfer(){
    await this._connection?.invoke("StartTransfer", this._clientId);
  }
}
