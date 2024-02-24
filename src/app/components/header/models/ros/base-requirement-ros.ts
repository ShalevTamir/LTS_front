export interface BaseRequirementRos{
    Value: string;
}

export function isRangeRequirement(requirement: BaseRequirementRos){
    return 'EndValue' in requirement;
}