import { TelemetryParameter } from "./telemetry-parameter.ros";

export class FilteredFrame{
    constructor(public Parameters: TelemetryParameter[], public TimeStamp: number){}
}