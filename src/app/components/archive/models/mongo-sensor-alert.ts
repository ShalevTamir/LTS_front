import { SensorState } from "../../live-parameters/models/enums/sensor-state.enum";

export interface MongoSensorAlert{
    sensorName: string,
    sensorStatus: string   
}