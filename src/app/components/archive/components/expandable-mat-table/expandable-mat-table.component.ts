import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { FilterColumnsPipe } from "./pipes/filter-columns-pipe";
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-expandable-mat-table',
    standalone: true,
    templateUrl: './expandable-mat-table.component.html',
    styleUrl: './expandable-mat-table.component.scss',
    animations: [
      trigger('detailExpand', [
        state('collapsed,void', style({height: '0px', minHeight: '0'})),
        state('expanded', style({height: '*'})),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      ]),
    ],
    imports: [MatTableModule, NgFor, MatIcon, NgIf, FilterColumnsPipe, MatButtonModule]
})
export class ExpandableMatTableComponent<TData> implements AfterViewInit{
  @Input({required: true}) dataSource!: TData[];
  @Input({required: true}) columnsToDisplay!: string[];
  expandedElement!: TData | null;
  expandColumnDef = 'expand';
  expandedDetailDef = 'expandedDetail'
  
  ngAfterViewInit(){
    setTimeout(() => {
      this.columnsToDisplay.push(this.expandColumnDef);
    });
  }

  filterMethod(columnName: string){
    !this.columnsToDisplay.includes(columnName);
  }
  handleRowClick(clickedElement: TData){
    
    this.expandedElement = this.expandedElement === clickedElement ? null : clickedElement
  }
}
