import { BaseRequirementRos } from "../../../components/header/models/ros/base-requirement-ros";
import { RequirementType } from "../../../components/requirements-uploader/models/enums/requirement-type";

export interface SensorRequirementRos{
    RequirementParam: BaseRequirementRos;
    Type: RequirementType
}