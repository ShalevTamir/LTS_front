import { MongoSensorAlertsRos } from "../../components/archive/models/ros/mongo-sensor-alert.ros";
import { FilteredFrameRos } from "./ros/filtered-frame.ros";

export type ArchiveData = FilteredFrameRos | MongoSensorAlertsRos;