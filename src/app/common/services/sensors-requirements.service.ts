import { Injectable } from "@angular/core";
import { AdditionalSensorRequirementRos } from "../models/ros/additional-sensor-requirement-ros";

@Injectable({
    providedIn: 'root'
})
export class SensorsRequirementsService{
    private _sensorsRequirements: Map<string, AdditionalSensorRequirementRos[]> = new Map();
    public saveSensorRequirements(sensorName: string, sensorRequirements: AdditionalSensorRequirementRos[]){
        
    }
    
}