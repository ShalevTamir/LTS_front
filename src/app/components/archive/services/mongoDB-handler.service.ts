import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LIVE_DATA_URL } from "../../../common/constants";

@Injectable({
    providedIn: 'root'
})
export class mongoDBHandlerService{
    constructor(private _httpClient: HttpClient){}

    fetchFrames(minTimeStamp: number, maxTimeStamp: number, maxSamplesInPage: number, pageNumber: number){
        this._httpClient.get(LIVE_DATA_URL+"/frames",{params: {
            MinTimeStamp: minTimeStamp,
            MaxTimeStamp: maxTimeStamp,
            MaxSamplesInPage: maxSamplesInPage,
            PageNumber: pageNumber
        }});
    }
}