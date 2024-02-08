import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { FilterColumnsPipe } from "./pipes/filter-columns-pipe";
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-mat-table',
    standalone: true,
    templateUrl: './mat-table.component.html',
    styleUrl: './mat-table.component.scss',
    animations: [
      trigger('detailExpand', [
        state('collapsed,void', style({height: '0px', minHeight: '0'})),
        state('expanded', style({height: '*'})),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      ]),
    ],
    imports: [MatTableModule, NgFor, MatIcon, NgIf, FilterColumnsPipe, MatButtonModule]
})
export class MatTableComponent<TData> implements AfterViewInit{
  @Input({required: true}) dataSource!: TData[];
  @Input({required: true}) columnsToDisplay!: string[];
  @Input() expandable: boolean = false;
  expandedElement!: TData | null;
  expandColumnDef = 'expand';
  expandedDetailDef = 'expandedDetail'
  
  ngAfterViewInit(){
    setTimeout(() => {
      if(this.expandable){
        this.columnsToDisplay.push(this.expandColumnDef);
      }
    });
  }

  filterMethod(columnName: string){
    !this.columnsToDisplay.includes(columnName);
  }
  handleRowClick(clickedElement: TData){
    console.log(clickedElement);
    // this.updateExpandedData(clickedTimestamp);
    this.expandedElement = this.expandedElement === clickedElement ? null : clickedElement
  }
}
