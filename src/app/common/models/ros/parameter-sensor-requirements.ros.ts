import { AdditionalSensorRequirementRos } from "./additional-sensor-requirement-ros";
import { SensorRequirementRos } from "./parameter-sensor-requirement.ros";

export interface ParameterSensorRequirementsRos{
    Requirements: SensorRequirementRos[];
    AdditionalRequirements: AdditionalSensorRequirementRos[];
}