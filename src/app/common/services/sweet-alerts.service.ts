import { Injectable } from "@angular/core";
import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";
import { Subtitle } from "../models/subtitle";

export interface customPreConfirm{
    preConfirmAsync: (...args: any[]) => Promise<void>,
    preConfirmArgs: any[]
}

export interface mulInputsCallbacks<T>{
    validationCallback: (...inputs: string[]) => Promise<T | string>,
    preConfirmCallback: (args: T) => Promise<void>
}

@Injectable({
    providedIn: 'root'
})
export class SweetAlertsService{
    readonly commonOptions: SweetAlertOptions = {
        background: 'radial-gradient(circle, rgb(26, 32, 73) 0%, rgb(19, 22, 47) 100%)',
        color: 'white',
        customClass: {
            confirmButton: "swal-btn-confirm"
        }
    }

    async customAlert(options: SweetAlertOptions): Promise<SweetAlertResult<any>>{
        
        return await Swal.fire({
            ...this.commonOptions,
            showLoaderOnConfirm: true,
            ...options
        } as SweetAlertOptions);
    }

    async inputAlert(title: string, subtitle: string = "") : Promise<SweetAlertResult<any>>{
        return await Swal.fire({
            ...this.commonOptions,
            title: title,
            input: "text",
            inputLabel: subtitle,
            showCancelButton: true,
            inputValidator: (value) => {
                if(!value){
                    return "You need to write something!";
                }
                return "";
            },
        });
    }

    async multipleInputAlert(title: string, subtitles: Subtitle[], preConfirmCallback: (inputs: string[]) => Promise<boolean>, options?: SweetAlertOptions): Promise<SweetAlertResult>{
        
        return await Swal.fire({
            ...this.commonOptions,
            title: title,
            html: this._generateMultipleInputsHtml(subtitles),
            showCancelButton: true,
            width: 650,
            preConfirm: async () => {
                let inputs: (HTMLInputElement | null)[] = [];
                for(let i=0; i < subtitles.length; i++){
                    inputs[i] = document.getElementById("swal-input-"+(i+1)) as HTMLInputElement;
                }
                if(inputs.some((input) => input?.value === "")){
                    Swal.showValidationMessage("All inputs are required");
                    return false;
                }
                let inputValues = inputs.filter((input) => input !== null).map((input) => (input as HTMLInputElement).value);
                if(preConfirmCallback !== undefined){
                    let preConfirmSucceeded: boolean = await preConfirmCallback(inputValues);
                    if(!preConfirmSucceeded){
                        return false;
                    }
                }
                return inputValues
              },
              ...options
        } as SweetAlertOptions);
    }

    public errorAlert(errorMessage: string): void{
        Swal.fire({
            title: errorMessage,
            icon: 'error',
            ...this.commonOptions
        });
    }

    public successAlert(successMessage: string): void{
        Swal.fire({
            title: successMessage,
            icon: 'success',
            ...this.commonOptions
        });
    }

    private _generateMultipleInputsHtml(subtitles: Subtitle[]){
        return `<style>.swal2-validation-message{background-color:transparent !important; color: white;}</style>`+subtitles
        .map((subtitle: Subtitle, index) => {
            return `<label for="swal-input-${index+1} custom-swal2-input" style='display:block;'>${subtitle.subtitleDescription}</label>`.concat(
                    subtitle.expand ? 
                    `<textarea id="swal-input-${index+1}" class="swal2-textarea custom-swal2-input"></textarea>` :
                    `<input id="swal-input-${index+1}" class="swal2-input custom-swal2-input" />`);
                    
            
        })
        .join("\n");
    }
}