import { normalizeString } from "../../../../common/utils/string-utils";
import { DurationType } from "../enums/duration-type"
import { BaseRequirementRos, requirementToString } from "./base-requirement-ros"

export interface DurationRos{
    DurationType: DurationType
    Requirement: BaseRequirementRos
}

export function durationToString(duration?: DurationRos){
    if(duration != null){
        return requirementToString(duration.Requirement) 
        + " "
        + normalizeString(DurationType[duration.DurationType]);
    }
    return "None";
}