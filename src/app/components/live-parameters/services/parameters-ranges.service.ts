import { Injectable } from "@angular/core";
import { LIVE_DATA_URL } from "../../../common/constants";
import { ParametersListDto } from "../models/dtos/parameters-list.dto";
import { HttpClient } from "@angular/common/http";
import { ParameterData } from "../models/ros/parameter-range.ros";
import { firstValueFrom } from "rxjs";
import { RequestsService } from "../../../common/services/network/requests.service";

@Injectable({
    providedIn: 'root'
})
export class ParametersConfigService{

    constructor(private _reqeustsService: RequestsService){}

    public async getParamsData(parametersNames: string[]): Promise<ParameterData[]>{
        return (await this._reqeustsService.post<ParameterData[]>(LIVE_DATA_URL+"/parameters-config/parameters-data",new ParametersListDto(parametersNames))).result as ParameterData[];
    }

    public async getParameterNames(): Promise<string[]>{
        return (await this._reqeustsService.get<string[]>(LIVE_DATA_URL+"/parameters-config/parameter-names")).result as string[];
    }
}