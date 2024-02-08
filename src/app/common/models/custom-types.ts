import { MongoSensorAlertsRos } from "../../components/archive/models/ros/mongo-sensor-alert.ros";
import { FilteredFrame } from "./ros/filtered-frame.ros";

export type ArchiveData = FilteredFrame | MongoSensorAlertsRos;