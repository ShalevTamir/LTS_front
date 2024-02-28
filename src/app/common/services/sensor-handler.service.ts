import Swal, { SweetAlertResult } from "sweetalert2";
import { SweetAlertsService } from "./sweet-alerts.service";
import { LIVE_TELE_URL } from "../constants";
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable, catchError, firstValueFrom, throwError } from "rxjs";
import { SensorAlertsRos } from "../../components/live-parameters/models/ros/sensor-alert.ros";
import { SensorRequirementRos } from "../../components/header/models/ros/sensor-requirement-ros";
import { BaseRequirementRos, isRangeRequirement } from "../../components/header/models/ros/base-requirement-ros";
import { DurationRos } from "../../components/header/models/ros/duration-ros";
import { DurationType } from "../../components/header/models/enums/duration-type";
import { normalizeString } from "../utils/string-utils";
import { RangeRequirementRos } from "../../components/header/models/ros/range-requirement-ros";
import { DynamicSensorDto } from "../../components/header/models/dtos/dynamic-sensor.dto";
import { ParametersConfigService } from "../../components/live-parameters/services/parameters-ranges.service";

export interface parsedSensor{
    sensorName: string,
    sensorRequirements: SensorRequirementRos[]
}

@Injectable({
    providedIn: 'root'
})
export class SensorHandlerService{
    readonly sensorRequirementAlertCss = 
    `<style>
    .requirement-card {
        border-radius: 30px 15px;
        border: 1px solid #ffffff70;
        padding: 15px;
        display: flex;
        flex-direction: column;
        margin-bottom: 15px;
    }

    .requirement-card .sensor-name{
        font-size: 25px;
    }
    
    .requirement-card .sensor-value, .requirement-card .sensor-duration{
        text-align: center;
        font-size: 17px;
    }
    
    .requirement-card *{
        margin-bottom: 10px;
    }
    </style>`;

    constructor(
        private _sweetAlertsService: SweetAlertsService,
        private _httpClient: HttpClient,
        private _parametersConfigService: ParametersConfigService
        ){
        
    }
    async addDynamicSensorAsync(){
        await this._sweetAlertsService.multipleInputAlert("Add Dynamic Sensor", [
            {subtitleDescription: "Sensor Name", expand: false},
            {subtitleDescription: "Sensor Description", expand: true}
        ], this.parseSensorRequirementsAsync,
            {showLoaderOnConfirm: true}
            );
    }
    
    async removeDynamicSensorAsync(sensorName: string){
        try{
            const headers = new HttpHeaders({
            'Content-Type': 'application/json'
            });
            let reqRes = this._httpClient.post(LIVE_TELE_URL+"/live-sensors/remove-sensor", JSON.stringify(sensorName), {headers: headers});
            await firstValueFrom(reqRes);
        }
        catch(e){
            if(e instanceof HttpErrorResponse){
                console.log(e);
                this._sweetAlertsService.errorAlert(e.error);
            }
            return;
        }
    }

    async getSensorsStateAsync(): Promise<SensorAlertsRos[]>{
        let reqRes = this._httpClient.get<SensorAlertsRos[]>(LIVE_TELE_URL+"/live-sensor-alerts");
        return await firstValueFrom(reqRes);
    }

    private parseSensorRequirementsAsync = async (clientInputs: string[]) => {
        let [sensorName, sensorRequirements] = clientInputs;
        let parseSensorRequest = this._httpClient.get<SensorRequirementRos[]>(LIVE_TELE_URL+"/live-sensors/parse-sensor",{params: {
            sensorName: sensorName,
            sensorRequirements: sensorRequirements
        }});
        let parsedRequirements;
        try{
            parsedRequirements = await firstValueFrom(parseSensorRequest);        
        }
        catch(e){
            if(e instanceof HttpErrorResponse){
                Swal.showValidationMessage(e.error);
                return false;
            }
        }
        this.showSensorRequirementsAsync(sensorName, parsedRequirements as SensorRequirementRos[])
        return true;

    }
    
    private showSensorRequirementsAsync = async (sensorName: string, sensorRequirements: SensorRequirementRos[]) => {
        let requirementsHtml = this.sensorRequirementAlertCss +
        sensorRequirements.map((sensorRequirement) => 
        `<div class="requirement-card">
        <span class="sensor-name">${sensorRequirement.ParameterName}</span>
        <span class="sensor-value">${isRangeRequirement(sensorRequirement.Requirement) ? "Range" : "Value"} : ${this.requirementToText(sensorRequirement.Requirement)}</span>
        <span class="sensor-duration">Duration: ${this.durationToText(sensorRequirement.Duration)}</span>
        </div>`).join('\n');
        await this._sweetAlertsService.customAlert({
            title: "Sensor Requirements",
            html: requirementsHtml,
            confirmButtonText: 'Confirm',
            showCancelButton: true,
            preConfirm: async () =>{
                await this.sendSensorToAddAsync(sensorName, sensorRequirements);
            }
        });
        
    }
    
    private sendSensorToAddAsync = async (sensorName: string, parsedRequirements: SensorRequirementRos[]) => {
        let dynamicSensor: DynamicSensorDto = {
            SensorName:  sensorName,
            Requirements: parsedRequirements
        }
        try{
            let reqRes = this._httpClient.post(LIVE_TELE_URL+"/live-sensors/add-sensor", dynamicSensor);
            await firstValueFrom(reqRes);
        }
        catch(e){
            if(e instanceof HttpErrorResponse){
                this._sweetAlertsService.errorAlert(e.error);
            }
            return;
        }
        this._sweetAlertsService.successAlert("Sensor " + sensorName + " added successfuly");
    }
    private requirementToText(requirement: BaseRequirementRos){
        if(isRangeRequirement(requirement)){
          let rangeRequirement = requirement as RangeRequirementRos;
          if(+rangeRequirement.Value == -Infinity){
            return "Below " + rangeRequirement.EndValue;
          }
          else if(+rangeRequirement.EndValue == Infinity){
            return "Above " + rangeRequirement.Value;
          }
          else{
            return rangeRequirement.Value+" - "+rangeRequirement.EndValue;
          }
        }
        else{
          return requirement.Value;
        }
    }
    
    private durationToText(duration?: DurationRos){
        if(duration != null){
            return this.requirementToText(duration.Requirement) 
            + " "
            + normalizeString(DurationType[duration.DurationType]);
        }
        return "None";
    }
}