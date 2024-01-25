export function seperateString(strToSeperate: string, seperatorChar: string): string{
    return strToSeperate    
        .split(seperatorChar)
        .map((word: string) => {
        return word.charAt(0).toLocaleUpperCase() + word.substring(1);
        }).join(" ");
}