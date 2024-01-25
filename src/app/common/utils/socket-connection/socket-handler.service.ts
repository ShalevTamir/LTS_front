import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { HubListener } from "../../models/hub-listener";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
export class SocketHandlerService{
    constructor() { }
  
    public async initWebSocket(server_url : string, listeners: HubListener[]): Promise<HubConnection>{
        let hubConnection = new HubConnectionBuilder()
            .withUrl(server_url)
            .build();
        listeners.forEach((listener) => {
            hubConnection.on(listener.listenerName, listener.callback);
        });
  
      await hubConnection.start();
      return hubConnection;
    }
  }
  