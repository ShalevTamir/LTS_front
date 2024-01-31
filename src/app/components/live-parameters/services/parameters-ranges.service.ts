import { Injectable } from "@angular/core";
import { LIVE_DATA_URL } from "../../../common/constants";
import { ParametersListDto } from "../models/dtos/parameters-list.dto";
import { HttpClient } from "@angular/common/http";
import { ParameterRange } from "../models/ros/parameter-range.ros";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ParametersRangesService{

    constructor(private _httpClient: HttpClient){}

    public async getRanges(parametersNames: string[]): Promise<ParameterRange[]>{
        let reqRes = this._httpClient.post<ParameterRange[]>(LIVE_DATA_URL+"/parameters-config",new ParametersListDto(parametersNames))
        return await firstValueFrom(reqRes);
    }
}