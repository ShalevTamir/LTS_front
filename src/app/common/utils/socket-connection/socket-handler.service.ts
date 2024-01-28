import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { HubListener } from "../../models/hub-listener";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
export class SocketHandlerService{
    constructor() { }
  
    public initWebSocket(server_url : string, listeners: HubListener[]): HubConnection{
        let hubConnection = new HubConnectionBuilder()
            .withUrl(server_url)
            .build();
        listeners.forEach((listener) => {
            hubConnection.on(listener.listenerName, listener.callback);
        });
  
      return hubConnection;
    }

    // public async disconnectWebSocket(connection: HubConnection){
    //   await connection.stop();
    // }

    // public async reconnectWebSocket(connection: HubConnection){
    //   await connection.start();
    // }
  }
  