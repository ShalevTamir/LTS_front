import { BaseRequirementRos } from "../../../header/models/ros/base-requirement-ros";
import { RequirementType } from "../enums/requirement-type";

export interface ParameterSensorRequirement{
    RequirementParam: BaseRequirementRos;
    Type: RequirementType
}