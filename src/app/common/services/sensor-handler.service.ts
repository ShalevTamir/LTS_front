import { SweetAlertResult } from "sweetalert2";
import { SweetAlertsService } from "./sweet-alerts.service";
import { LIVE_TELE_URL } from "../constants";
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { DirectSensorDto } from "../../components/header/models/direct-sensor-dto";
import { Observable, catchError, firstValueFrom, throwError } from "rxjs";
import { SensorAlertsRos } from "../../components/live-parameters/models/ros/sensor-alert.ros";

@Injectable({
    providedIn: 'root'
})
export class SensorHandlerService{
    constructor(private _sweetAlertsService: SweetAlertsService, private _httpClient: HttpClient){
        
    }
    async addDynamicSensorAsync(){
        let userInput: SweetAlertResult = (await this._sweetAlertsService.multipleInputAlert("Add Dynamic Sensor", ["Sensor Name","Sensor Description"]));
        let [sensorName, sensorDescription] = userInput.value;
        this._httpClient.post(LIVE_TELE_URL+"/live-sensor-alerts/add-sensor",new DirectSensorDto(sensorName, sensorDescription))
        .subscribe({
            error: (e: HttpErrorResponse) =>{
                this._sweetAlertsService.errorAlert(e.error);
            },
            next: (value) =>{
                this._sweetAlertsService.successAlert("Added sensor "+ sensorName + " succesfully");
            }

        });
    }

    async getSensorsState(): Promise<SensorAlertsRos[]>{
        let reqRes = this._httpClient.get<SensorAlertsRos[]>(LIVE_TELE_URL+"/live-sensor-alerts");
        return await firstValueFrom(reqRes);
    }
}