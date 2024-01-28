import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
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
  private _parametersToConfig!: string[]

  constructor(private _httpClient: HttpClient, private _socketHandler: SocketHandlerService) { 
  }

  public async initWebSocket(parametersToConfig: string[], processParameters: (filteredTeleFrame: FilteredFrame) => void){
    this._parametersToConfig = parametersToConfig;
    this._clientId ??= await this.retrieveClientId(parametersToConfig)
    this._connection = this._socketHandler.initWebSocket(this.SERVER_URL+"/live-parameters-socket", [
      {
        listenerName: 'receiveParameters',
        callback: processParameters
      },
      {
        listenerName: 'connectionStatus',
        callback: this.handleConnectionStatus
      }
    ]);
       
    if(this._connection.state == HubConnectionState.Disconnected){
      await this._connection.start();
    }
    await this.startParametersTransfer();
  }

  public async stopWebSocket(){
    await this._connection?.stop();
  }
  
  private async retrieveClientId(parametersToConfig: string[]): Promise<string>{
    let reqRes = this._httpClient.post<ClientConnectionId>(this.SERVER_URL+"/socket-config",new ParametersListDto(parametersToConfig));
    let connectionIdRos: ClientConnectionId = await firstValueFrom(reqRes);
    return connectionIdRos.ConnectionId;
  }

  private async startParametersTransfer(){
    await this._connection?.invoke("StartTransfer", this._clientId);
  }

  private handleConnectionStatus = async (connectionSuccessful: boolean) => {
    if(!connectionSuccessful){
      this._clientId = await this.retrieveClientId(this._parametersToConfig);
      await this.startParametersTransfer();
    }
  }

}
