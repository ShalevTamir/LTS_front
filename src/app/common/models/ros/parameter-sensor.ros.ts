import { BaseRequirementRos } from "../../../components/header/models/ros/base-requirement-ros";
import { AdditionalSensorRequirementRos } from "./additional-sensor-requirement-ros";
import { SensorRequirementRos } from "./parameter-sensor-requirement.ros";
import { ParameterSensorRequirementsRos } from "./parameter-sensor-requirements.ros";

export interface ParameterSensorRos extends ParameterSensorRequirementsRos{
    SensedParamName: string;
}