import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { firstValueFrom } from 'rxjs';
import { ParametersListDto } from '../models/dtos/parameters-list.dto';
import { ClientConnectionId } from '../models/ros/client-connection-id.ros';
import { FilteredFrameRos } from '../../../common/models/ros/filtered-frame.ros';
import { SocketHandlerService } from '../../../common/utils/socket-connection/socket-handler.service';
import { LIVE_DATA_URL } from '../../../common/constants';
import { ModifyParametersDto } from '../models/dtos/add-parameter-dto';
import { RequestsService } from '../../../common/services/network/requests.service';

@Injectable({
  providedIn: 'root'
})
export class LiveParametersSocketService {
  private _connection: HubConnection | undefined;
  private _clientId: string | undefined;
  private _parametersToConfig!: string[]

  constructor(private _reqeustsService: RequestsService, private _socketHandler: SocketHandlerService) { 
  }

  public async initWebSocket(parametersToConfig: string[], processParameters: (filteredTeleFrame: FilteredFrameRos) => void){
    this._parametersToConfig = parametersToConfig;
    this._clientId ??= await this.retrieveClientId(parametersToConfig)
    this._connection = await this._socketHandler.initWebSocketAsync(LIVE_DATA_URL+"/live-parameters-socket", [
      {
        listenerName: 'receiveParameters',
        callback: processParameters
      },
      {
        listenerName: 'connectionStatus',
        callback: this.handleConnectionStatus
      }
    ]);
        
    await this.startParametersTransfer();
  }

  public async stopWebSocket(){
    await this._connection?.stop();
  }

  public async addParameter(parameterName: string){
    const parameterToAdd: ModifyParametersDto = {
      ParameterName: parameterName,
      ClientId: this._clientId as string
    }
    await this._reqeustsService.post(LIVE_DATA_URL+"/socket-config/add-parameter", parameterToAdd);
  }

  public async removeParameter(parameterName: string){
    const parameterToRemove: ModifyParametersDto = {
      ParameterName: parameterName,
      ClientId: this._clientId as string
    }
    await this._reqeustsService.post(LIVE_DATA_URL+"/socket-config/remove-parameter", parameterToRemove);
  }
  
  private async retrieveClientId(parametersToConfig: string[]): Promise<string>{
    let responseResult = await this._reqeustsService.post<ClientConnectionId>(LIVE_DATA_URL+"/socket-config/config",new ParametersListDto(parametersToConfig));
    let connectionIdRos: ClientConnectionId = responseResult.result as ClientConnectionId;
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
