import { SweetAlertResult } from "sweetalert2";
import { SweetAlertsService } from "./sweet-alerts.service";
import { LIVE_TELE_URL } from "../constants";
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { DirectSensorDto } from "../../components/header/models/dtos/direct-sensor-dto";
import { Observable, catchError, firstValueFrom, throwError } from "rxjs";
import { SensorAlertsRos } from "../../components/live-parameters/models/ros/sensor-alert.ros";
import { SensorRequirementRos } from "../../components/header/models/ros/sensor-requirement-ros";
import { BaseRequirementRos } from "../../components/header/models/ros/base-requirement-ros";

@Injectable({
    providedIn: 'root'
})
export class SensorHandlerService{
    constructor(private _sweetAlertsService: SweetAlertsService, private _httpClient: HttpClient){
        
    }
    async addDynamicSensorAsync(){
        await this._sweetAlertsService.multipleInputAlert("Add Dynamic Sensor", [
            {subtitleDescription: "Sensor Name", expand: false},
            {subtitleDescription: "Sensor Description", expand: true}
        ], this.parseSensorRequirements);
    }

    private parseSensorRequirements = async (...inputs: string[]) => {
        let [sensorName, sensorRequirements] = inputs;
        let reqRes = this._httpClient.post<SensorRequirementRos[]>(LIVE_TELE_URL+"/live-sensor-alerts/add-sensor",new DirectSensorDto(sensorName, sensorRequirements));
        let parsedRequirements: SensorRequirementRos[] = await firstValueFrom(reqRes);
        console.log(parsedRequirements);
        this._sweetAlertsService.successAlert("Added sensor "+ sensorName + " succesfully");
    }

    async getSensorsState(): Promise<SensorAlertsRos[]>{
        let reqRes = this._httpClient.get<SensorAlertsRos[]>(LIVE_TELE_URL+"/live-sensor-alerts");
        return await firstValueFrom(reqRes);
    }
}