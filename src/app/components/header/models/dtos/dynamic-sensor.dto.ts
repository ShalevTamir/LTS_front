import { AdditionalSensorRequirementRos } from "../../../../common/models/ros/additional-sensor-requirement-ros";

export interface DynamicSensorDto{
    SensorName: string,
    Requirements: AdditionalSensorRequirementRos[]
}