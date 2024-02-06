import { SensorState } from "../../../live-parameters/models/enums/sensor-state.enum";
import { SensorAlertsRos } from "../../../live-parameters/models/ros/sensor-alert.ros";

export class MongoSensorAlertsRos{
    constructor(public SensorName: string, public Status: SensorState, public TimeStamp: number){}
}