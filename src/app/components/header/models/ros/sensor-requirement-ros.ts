import { BaseRequirementRos } from "./base-requirement-ros";
import { DurationRos } from "./duration-ros";

export interface SensorRequirementRos{
    ParameterName: string,
    Requirement: BaseRequirementRos,
    Duration: DurationRos
}