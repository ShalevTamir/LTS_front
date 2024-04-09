import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LIVE_DATA_URL, LIVE_TELE_URL } from "../../../common/constants";
import { firstValueFrom } from "rxjs";
import { DataType } from "../models/enums/data-type";
import { FilteredFrameRos } from "../../../common/models/ros/filtered-frame.ros";
import { MongoSensorAlertsRos } from "../models/ros/mongo-sensor-alert.ros";
import { CountDataRos } from "../models/ros/count-data.ros";
import { ArchiveData } from "../../../common/models/custom-types";
import { RequestsService } from "../../../common/services/network/requests.service";

@Injectable({
    providedIn: 'root'
})
export class mongoDBHandlerService{
    constructor(private _requestsService: RequestsService){}

    async fetchFrames(minTimeStamp: number, maxTimeStamp: number, maxSamplesInPage: number, pageNumber: number): Promise<FilteredFrameRos[]>{
        return await this.fetchData(DataType.PARAMETERS, minTimeStamp, maxTimeStamp, maxSamplesInPage, pageNumber) as FilteredFrameRos[];
    }

    async fetchAlerts(minTimeStamp: number, maxTimeStamp: number, maxSamplesInPage: number, pageNumber: number): Promise<MongoSensorAlertsRos[]>{
        return await this.fetchData(DataType.ALERTS, minTimeStamp, maxTimeStamp, maxSamplesInPage, pageNumber) as MongoSensorAlertsRos[];
    }

    async fetchData(dataType: DataType, minTimeStamp: number, maxTimeStamp: number, maxSamplesInPage: number, pageNumber: number): Promise<ArchiveData[]>{
        return (await this._requestsService.get<(FilteredFrameRos | MongoSensorAlertsRos)[]>(this.dataTypeToUrl(dataType), {params: {
            MinTimeStamp: minTimeStamp,
            MaxTimeStamp: maxTimeStamp,
            MaxSamplesInPage: maxSamplesInPage,
            PageNumber: pageNumber
        }})).result as ArchiveData[];
    }    

    async countData(dataType: DataType, minTimeStamp: number, maxTimeStamp: number){
        return ((await this._requestsService.get<CountDataRos>(this.dataTypeToUrl(dataType)+"/count", {params: {
            MinTimeStamp: minTimeStamp,
            MaxTimeStamp: maxTimeStamp
        }})).result as CountDataRos).Count;
    }

    private dataTypeToUrl(dataType: DataType){
        switch(dataType){
            case DataType.PARAMETERS:
                return LIVE_DATA_URL+'/frames';
            case DataType.ALERTS:
                return LIVE_TELE_URL+'/mongo-alerts'
        }
    }
}