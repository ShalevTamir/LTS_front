import { SensorRequirementRos } from "../ros/sensor-requirement-ros";

export interface DynamicSensorDto{
    SensorName: string,
    Requirements: SensorRequirementRos[]
}