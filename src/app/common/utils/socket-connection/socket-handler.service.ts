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
  