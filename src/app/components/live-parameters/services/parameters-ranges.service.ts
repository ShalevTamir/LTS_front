import { Injectable } from "@angular/core";
import { LIVE_DATA_URL } from "../../../common/constants";
import { ParametersListDto } from "../models/dtos/parameters-list.dto";
import { HttpClient } from "@angular/common/http";
import { ParameterData } from "../models/ros/parameter-range.ros";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ParametersConfigService{

    constructor(private _httpClient: HttpClient){}

    public async getParamsData(parametersNames: string[]): Promise<ParameterData[]>{
        let reqRes = this._httpClient.post<ParameterData[]>(LIVE_DATA_URL+"/parameters-config/parameters-data",new ParametersListDto(parametersNames))
        return await firstValueFrom(reqRes);
    }

    public async getParameterNames(): Promise<string[]>{
        let reqRes = this._httpClient.get<string[]>(LIVE_DATA_URL+"/parameters-config/parameter-names");
        return await firstValueFrom(reqRes);
    }
}