import { Injectable } from "@angular/core";
import { GaugeData } from "../models/gauge-data";

@Injectable({
    providedIn: "root"
})
export class GaugesDataPersistenceService{
    private _gaugesData: { [parameterName: string]: GaugeData }
    private _resolverMethods: {[parameterName: string]: (gaugeData: GaugeData) => void}
    constructor(){
        this._gaugesData = {}
        this._resolverMethods = {}
    }

    public saveGaugeData(gaugeParameterName: string, gaugeData: GaugeData){
        this._gaugesData[gaugeParameterName] = gaugeData;
        if (gaugeParameterName in this._resolverMethods){
            this._resolverMethods[gaugeParameterName](gaugeData);
        }
    }

    public getGaugeDataAsync(gaugeParameterName: string): Promise<GaugeData>{
        return new Promise<GaugeData>((resolve) => {
            if(gaugeParameterName in this._gaugesData){
                resolve(this._gaugesData[gaugeParameterName]);
            }        
            else{
                this._resolverMethods[gaugeParameterName] = resolve;
            }
        })
    }
   
    public hasGaugeData(gaugeParameterName: string): boolean{
        return gaugeParameterName in this._gaugesData;
    }

}