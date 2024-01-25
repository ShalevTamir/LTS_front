import { SensorState } from "../enums/sensor-state.enum"

export class SensorAlertsRos{
    constructor(
        public SensorName: string,
        public CurrentStatus: SensorState
    ){}
}