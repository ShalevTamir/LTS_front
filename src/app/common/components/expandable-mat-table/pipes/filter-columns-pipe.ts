import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    standalone: true,
    name: 'filterColumns'
})
export class FilterColumnsPipe implements PipeTransform{
    transform(columnsToDisplay: string[], expandColumnDef: string) {
        return columnsToDisplay.filter((columnName) => columnName!==expandColumnDef);
    }
    
}