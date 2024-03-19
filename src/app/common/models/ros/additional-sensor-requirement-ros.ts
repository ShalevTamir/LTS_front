import { BaseRequirementRos } from "../../../components/header/models/ros/base-requirement-ros";
import { DurationRos } from "../../../components/header/models/ros/duration-ros";

export interface AdditionalSensorRequirementRos{
    ParameterName: string,
    Requirement: BaseRequirementRos,
    Duration?: DurationRos
}