import { RangeRequirementRos } from "./range-requirement-ros";

export interface BaseRequirementRos{
    Value: string;
}

export function isRangeRequirement(requirement: BaseRequirementRos){
    return 'EndValue' in requirement;
}

export function requirementToString(requirement: BaseRequirementRos){
    if(isRangeRequirement(requirement)){
      let rangeRequirement = requirement as RangeRequirementRos;
      if(+rangeRequirement.Value == -Infinity){
        return "Below " + rangeRequirement.EndValue;
      }
      else if(+rangeRequirement.EndValue == Infinity){
        return "Above " + rangeRequirement.Value;
      }
      else{
        return rangeRequirement.Value+" - "+rangeRequirement.EndValue;
      }
    }
    else{
      return requirement.Value;
    }
}