import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LIVE_DATA_URL, LIVE_TELE_URL } from "../../../common/constants";
import { firstValueFrom } from "rxjs";
import { DataType } from "../models/enums/data-type";
import { FilteredFrame } from "../../../common/models/ros/filtered-frame.ros";
import { MongoSensorAlertsRos } from "../models/ros/mongo-sensor-alert.ros";

@Injectable({
    providedIn: 'root'
})
export class mongoDBHandlerService{
    constructor(private _httpClient: HttpClient){}

    async fetchData(dataType: DataType, minTimeStamp: number, maxTimeStamp: number, maxSamplesInPage: number, pageNumber: number): Promise<(FilteredFrame | MongoSensorAlertsRos)[]>{
        return await firstValueFrom(this._httpClient.get<(FilteredFrame | MongoSensorAlertsRos)[]>(this.dataTypeToUrl(dataType), {params: {
            MinTimeStamp: minTimeStamp,
            MaxTimeStamp: maxTimeStamp,
            MaxSamplesInPage: maxSamplesInPage,
            PageNumber: pageNumber
        }}));
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