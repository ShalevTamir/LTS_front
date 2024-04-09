import { HttpErrorResponse } from "@angular/common/http";

export function catchHttpException(){
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor){
        const original: Function = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            try {
                return await original.apply(this, args);
            }
            catch(e){
                if (e instanceof HttpErrorResponse){
                    return undefined;
                }
                else{
                    throw e;
                }
            }
        }
    }
}