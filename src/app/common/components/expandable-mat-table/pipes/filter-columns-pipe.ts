import { Pipe, PipeTransform } from "@angular/core";
import { TableColumn } from "../models/tableColumn";

@Pipe({
    standalone: true,
    name: 'filterColumns'
})
export class FilterColumnsPipe implements PipeTransform{
    transform(columnsToDisplay: TableColumn[], expandColumnDef: string) {
        return columnsToDisplay.filter((columnName) => columnName.internalName !== expandColumnDef);;
    }
    
}