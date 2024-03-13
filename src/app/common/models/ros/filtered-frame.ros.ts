import { TelemetryParameterRos } from "./telemetry-parameter.ros";

export class FilteredFrameRos{
    constructor(public Parameters: TelemetryParameterRos[], public TimeStamp: number){}
}