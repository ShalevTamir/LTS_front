import { SensorState } from "../../../live-parameters/models/enums/sensor-state.enum";
import { SensorAlertsRos } from "../../../live-parameters/models/ros/sensor-alert.ros";

export interface MongoSensorAlertsRos{
    SensorName: string,
    SensorStatus: SensorState
    TimeStamp: number
}