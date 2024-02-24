import { DurationType } from "../enums/duration-type"
import { BaseRequirementRos } from "./base-requirement-ros"

export interface DurationRos{
    DurationType: DurationType
    Requirement: BaseRequirementRos
}