import { isNullOrUndef } from "./helper";

export function seperateString(strToSeperate: string, seperatorChar: string): string{
    return strToSeperate    
        .split(seperatorChar)
        .map((word: string) => {
        return word.charAt(0).toLocaleUpperCase() + word.substring(1);
        }).join(" ");
}

export function normalizeString(strToNormalize: string){
    return strToNormalize.charAt(0).toUpperCase() + strToNormalize.slice(1).toLowerCase();
}

export function extractNumbers(strToExtractFrom: string): number | undefined{
    let result = strToExtractFrom.match(/\d+/)?.[0];
    return !result ? undefined : +result;
}