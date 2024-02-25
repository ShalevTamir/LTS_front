import { SensorState } from "../../../live-parameters/models/enums/sensor-state.enum";
import { SensorAlertsRos } from "../../../live-parameters/models/ros/sensor-alert.ros";

export interface MongoSensorAlertRos{
    SensorName: string,
    SensorStatus: SensorState
}

export interface MongoSensorAlertsRos{
    TimeStamp: number
    MongoAlerts: MongoSensorAlertRos[]
}