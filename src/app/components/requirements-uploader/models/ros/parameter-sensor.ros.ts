import { BaseRequirementRos } from "../../../header/models/ros/base-requirement-ros";
import { SensorRequirementRos } from "../../../header/models/ros/sensor-requirement-ros";
import { ParameterSensorRequirement } from "./parameter-sensor-requirement.ros";

export interface ParameterSensorRos{
    SensedParamName: string;
    Requirements: ParameterSensorRequirement[];
    AdditionalRequirements: SensorRequirementRos[];
}