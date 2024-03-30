import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { HubListener } from "../../models/hub-listener";
import { Injectable } from "@angular/core";
import { TOKEN_STORAGE_KEY } from "../../models/constants";
import { isNullOrUndef } from "../helper";
import { AuthService } from "../../services/auth/auth.service";

@Injectable({
    providedIn: 'root'
  })
export class SocketHandlerService{
    constructor(private _authService: AuthService) { }

    public async initWebSocketAsync(server_url : string, listeners: HubListener[]): Promise<HubConnection>{
      let hubConnection = new HubConnectionBuilder()
          .withUrl(this.buildConnectionUrl(server_url))
          .build();
      listeners.forEach((listener) => {
          hubConnection.on(listener.listenerName, listener.callback);
      });
      await hubConnection
      .start()
      .catch((error: Error) =>{
        this._authService.handleInvalidToken(this.extractSignalRErrorMessage(error));
      });
      return hubConnection;
    }

    private extractSignalRErrorMessage(error: Error): string{
      return error.message.split(':')[2];
    }
    
    private buildConnectionUrl(server_url: string): string{
      return isNullOrUndef(localStorage.getItem(TOKEN_STORAGE_KEY)) ?
      server_url :
      server_url + `?access_token=${localStorage.getItem(TOKEN_STORAGE_KEY)}`;
    }


    public async restartSocket(connection: HubConnection, listeners: HubListener[]){
      //un-register previous handlers
      this.unregisterListeners(connection, listeners);
      this.registerListeners(connection, listeners);
      await connection.start();
    }

    private unregisterListeners(connection: HubConnection, listeners: HubListener[]){
      listeners.forEach((listener) => {
        connection.off(listener.listenerName);
      })
    }

    private registerListeners(connection: HubConnection, listeners: HubListener[]){
      listeners.forEach((listener) => {
        connection.on(listener.listenerName, listener.callback);
      });
    }


    // public async disconnectWebSocket(connection: HubConnection){
    //   await connection.stop();
    // }

    // public async reconnectWebSocket(connection: HubConnection){
    //   await connection.start();
    // }
  }
  