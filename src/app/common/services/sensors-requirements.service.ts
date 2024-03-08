import { Injectable } from "@angular/core";
import { SensorRequirementRos } from "../../components/header/models/ros/sensor-requirement-ros";

@Injectable({
    providedIn: 'root'
})
export class SensorsRequirementsService{
    private _sensorsRequirements: Map<string, SensorRequirementRos[]> = new Map();
    public saveSensorRequirements(sensorName: string, sensorRequirements: SensorRequirementRos[]){
        
    }
    
}