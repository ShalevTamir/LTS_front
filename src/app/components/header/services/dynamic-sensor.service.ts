import { SweetAlertResult } from "sweetalert2";
import { SweetAlertsService } from "../../../common/services/sweet-alerts.service";
import { LIVE_TELE_URL } from "../../../common/constants";
import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { DirectSensorDto } from "../models/direct-sensor-dto";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DynamicSensorService{
    constructor(private _sweetAlertsService: SweetAlertsService, private _httpClient: HttpClient){
        
    }
    async addDynamicSensorAsync(){
        let userInput: SweetAlertResult = (await this._sweetAlertsService.multipleInputAlert("Add Dynamic Sensor", ["Enter sensor name","Enter sensor description"]));
        let [sensorName, sensorDescription] = userInput.value;
        let reqRes = this._httpClient.post(LIVE_TELE_URL+"/sensor-alerts/add-sensor",new DirectSensorDto(sensorName, sensorDescription));

        console.log(await firstValueFrom(reqRes));
    }
}