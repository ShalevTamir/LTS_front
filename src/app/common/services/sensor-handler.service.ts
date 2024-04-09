import Swal, { SweetAlertResult } from "sweetalert2";
import { SweetAlertsService } from "./sweet-alerts.service";
import { LIVE_TELE_URL } from "../constants";
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable, catchError, firstValueFrom, throwError } from "rxjs";
import { SensorAlertsRos } from "../../components/live-parameters/models/ros/sensor-alert.ros";
import { AdditionalSensorRequirementRos } from "../models/ros/additional-sensor-requirement-ros";
import { BaseRequirementRos, isRangeRequirement, requirementToString } from "../../components/header/models/ros/base-requirement-ros";
import { DurationRos, durationToString } from "../../components/header/models/ros/duration-ros";
import { DurationType } from "../../components/header/models/enums/duration-type";
import { normalizeString } from "../utils/string-utils";
import { RangeRequirementRos } from "../../components/header/models/ros/range-requirement-ros";
import { DynamicSensorDto } from "../../components/header/models/dtos/dynamic-sensor.dto";
import { ParametersConfigService } from "../../components/live-parameters/services/parameters-ranges.service";
import { ParameterSensorRequirementsRos } from "../models/ros/parameter-sensor-requirements.ros";
import { SensorRequirementRos } from "../models/ros/parameter-sensor-requirement.ros";
import { RequirementType } from "../../components/requirements-uploader/models/enums/requirement-type";
import { ParameterSensorRos } from "../models/ros/parameter-sensor.ros";
import { RequestsService } from "./network/requests.service";
import { isNullOrUndef } from "../utils/helper";

export interface parsedSensor{
    sensorName: string,
    sensorRequirements: AdditionalSensorRequirementRos[]
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

    .type-valid{
        border: 1px solid green;
    }

    .type-warning{
        border: 1px solid yellow;
    }

    .type-invalid{
        border: 1px solid red;
    }
    </style>`;

    private _sensorsRequirements: Map<string, ParameterSensorRequirementsRos> = new Map();

    constructor(
        private _sweetAlertsService: SweetAlertsService,
        private _requestsService: RequestsService,
        ){
        
    }    

    displaySensorRequirements(sensorName: string){
        let sensorRequirements = this._sensorsRequirements.get(sensorName) as ParameterSensorRequirementsRos;
        console.log(sensorRequirements);
        let requirementsHtml = this.sensorRequirementAlertCss +
        sensorRequirements.AdditionalRequirements.map((additionalRequirement) =>
        this.requirementToHtml(additionalRequirement.ParameterName, additionalRequirement.Requirement, undefined, additionalRequirement.Duration)).join('\n');
        if(sensorRequirements.Requirements){
            requirementsHtml = sensorRequirements.Requirements.map((parameterRequirement) => 
            this.requirementToHtml(sensorName, parameterRequirement.RequirementParam, parameterRequirement.Type)
            ).join('\n') + requirementsHtml;
        }
        this._sweetAlertsService.customAlert({
            title: normalizeString(sensorName) + " Requirements",
            html: requirementsHtml,
            confirmButtonText: 'Ok',
        });
    }

    requirementToHtml(name: string, requirement: BaseRequirementRos, requirementType?: RequirementType, duration?: DurationRos): string{
        return (
            `<div class="requirement-card ${requirementType !== undefined ? "type-" + RequirementType[requirementType].toLowerCase() : ""}">
            <span class="sensor-name">${name}</span>
            <span class="sensor-value">${isRangeRequirement(requirement) ? "Range" : "Value"} : ${requirementToString(requirement)}</span>
            <span class="sensor-duration">Duration: ${durationToString(duration)}</span>
            </div>
            `);
    }

    async fetchSensorRequirements(sensorName: string): Promise<void>{
        let sensorRequirements = this._sensorsRequirements.get(sensorName);
        if(sensorRequirements === undefined){
            let responseResult = await this._requestsService.get<ParameterSensorRequirementsRos>(
                LIVE_TELE_URL+"/live-sensors/sensor-requirements",
                {params: {sensorName: sensorName}});
            this._sensorsRequirements.set(sensorName, responseResult.result as ParameterSensorRequirementsRos);
        }        
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
        const headers = new HttpHeaders({
        'Content-Type': 'application/json'
        });
        await this._requestsService.post(LIVE_TELE_URL+"/live-sensors/remove-sensor", JSON.stringify(sensorName), {headers: headers});
    }

    async getSensorsStateAsync(): Promise<SensorAlertsRos[]>{
        return (await this._requestsService.get<SensorAlertsRos[]>(LIVE_TELE_URL+"/live-sensor-alerts")).result as SensorAlertsRos[];
    }

    async parseParameterSensorsAsync(formData: FormData): Promise<ParameterSensorRos[]>{
        return (await this._requestsService.post<ParameterSensorRos[]>(LIVE_TELE_URL+"/live-sensors/sensors-requirements", formData)).result as ParameterSensorRos[];
    }

    async uploadParameterSensorsAsync(parsedSensors: ParameterSensorRos[]){
        let parseResult = await this._requestsService.post(
            LIVE_TELE_URL+"/live-sensors/add-parameter-sensors",
            parsedSensors, {},
            (error: HttpErrorResponse) => {
                this._sweetAlertsService.errorAlert(error.error);
            },
            );
        if (parseResult.success){
            this._sweetAlertsService.successAlert("Sensors Added Succesfully");
            return parseResult.result;
        }
        return [];
    }

    private parseSensorRequirementsAsync = async (clientInputs: string[]) => {
        let [sensorName, sensorRequirements] = clientInputs;
        let parseResult = await this._requestsService.get<AdditionalSensorRequirementRos[]>(LIVE_TELE_URL+"/live-sensors/parse-sensor",{params: {
            sensorName: sensorName,
            sensorRequirements: sensorRequirements
        }}, (e: HttpErrorResponse) => {
            Swal.showValidationMessage(e.error);
        });        
        if (!parseResult.success){
            return false;
        }
        let parsedRequirements = parseResult.result as AdditionalSensorRequirementRos[];
        this._sensorsRequirements.set(sensorName, {Requirements: [], AdditionalRequirements: parsedRequirements});
        this.showSensorRequirementsAsync(sensorName, parsedRequirements)
        return true;

    }
    
    private showSensorRequirementsAsync = async (sensorName: string, sensorRequirements: AdditionalSensorRequirementRos[]) => {
        let requirementsHtml = this.sensorRequirementAlertCss +
        sensorRequirements.map((sensorRequirement) => 
        `<div class="requirement-card">
        <span class="sensor-name">${sensorRequirement.ParameterName}</span>
        <span class="sensor-value">${isRangeRequirement(sensorRequirement.Requirement) ? "Range" : "Value"} : ${requirementToString(sensorRequirement.Requirement)}</span>
        <span class="sensor-duration">Duration: ${durationToString(sensorRequirement.Duration)}</span>
        </div>`).join('\n');
        await this._sweetAlertsService.customAlert({
            title: "Sensor Requirements",
            html: requirementsHtml,
            confirmButtonText: 'Confirm',
            showCancelButton: true,
            preConfirm: async () =>{
                await this.sendSensorToAddAsync(sensorName, sensorRequirements);
            },
            showLoaderOnConfirm: true
        });
        
    }
    
    private sendSensorToAddAsync = async (sensorName: string, parsedRequirements: AdditionalSensorRequirementRos[]) => {
        let dynamicSensor: DynamicSensorDto = {
            SensorName:  sensorName,
            Requirements: parsedRequirements
        }
        await this._requestsService.post(LIVE_TELE_URL+"/live-sensors/add-dynamic-sensor", dynamicSensor);
        this._sweetAlertsService.successAlert("Sensor " + sensorName + " added successfuly");
    }
}