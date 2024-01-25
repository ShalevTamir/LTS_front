export interface HubListener{
    listenerName: string
    callback: (...args: any[]) => void 
}