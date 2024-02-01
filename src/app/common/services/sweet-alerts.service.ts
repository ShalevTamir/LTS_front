import { Injectable } from "@angular/core";
import Swal, { SweetAlertResult } from "sweetalert2";

@Injectable({
    providedIn: 'root'
})
export class SweetAlertsService{
    async inputAlert(title: string, subtitle: string = "") : Promise<SweetAlertResult<any>>{
        return await Swal.fire({
            title: title,
            input: "text",
            inputLabel: subtitle,
            showCancelButton: true,
            inputValidator: (value) => {
                if(!value){
                    return "You need to write something!";
                }
                return "";
            }
        });
    }
    async multipleInputAlert(title: string, subtitles: string[]): Promise<SweetAlertResult>{
        
        return await Swal.fire({
            title: title,
            html: this._generateMultipleInputsHtml(subtitles),
            showCancelButton: true,
            preConfirm: () => {
                let inputs: (HTMLInputElement | null)[] = [];
                for(let i=0; i < subtitles.length; i++){
                    inputs[i] = document.getElementById("swal-input-"+(i+1)) as HTMLInputElement;
                }
                if(inputs.some((input) => input?.value === "")){
                    Swal.showValidationMessage("All inputs are required!");
                    return false;
                }
                return inputs.map((input) => input?.value)
              }
        });
    }

    private _generateMultipleInputsHtml(subtitles: string[]){
        return subtitles
        .map((subtitle, index) => {
            return `<label for="swal-input-${index+1}">${subtitle}</label>
            <input id="swal-input-${index+1}" class="swal2-input">`;
        })
        .join("\n");
    }
}