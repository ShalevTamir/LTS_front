import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { FilterColumnsPipe } from "./pipes/filter-columns-pipe";
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableComponent } from "./components/mat-table/mat-table.component";
import { normalizeString } from '../../utils/string-utils';
import { TableColumn } from './models/tableColumn';

@Component({
    selector: 'app-expandable-mat-table',
    standalone: true,
    templateUrl: './expandable-mat-table.component.html',
    styleUrl: './expandable-mat-table.component.scss',
    animations: [
        trigger('detailExpand', [
            state('collapsed,void', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    imports: [NgFor, MatTableModule, MatIcon, NgIf, FilterColumnsPipe, MatButtonModule, MatTableComponent]
})
export class ExpandableMatTableComponent<ExpandableDataType, ExpandedDataType> implements AfterViewInit{
  @ViewChild('table', {static: true}) matTable!: MatTable<any>;
  @Output() rowClickedEmitter = new EventEmitter<ExpandableDataType>();
  @Input({required: true}) dataSource!: ExpandableDataType[];
  @Input({required: true}) columnsToDisplay!: TableColumn[];
  internalNameColumns!: string[];
  expandedElement!: ExpandableDataType | null;
  expandColumnDef = 'expand';
  expandedDetailDef = 'expandedDetail'
  expandedDataSource: ExpandedDataType[] = [];
  expandedColumnsToDisplay: TableColumn[] = [];

  normalizeStringInstance = normalizeString
  
  ngAfterViewInit(){
    setTimeout(() => {
      this.columnsToDisplay.unshift({displayName: this.expandColumnDef, internalName: this.expandColumnDef});
      this.internalNameColumns = this.columnsToDisplay.map((tableColumn) => tableColumn.internalName);
    });
  }

  protected handleRowClick(clickedElement: ExpandableDataType){
    this.expandedElement = this.expandedElement === clickedElement ? null : clickedElement;
    if(this.expandedElement){
      this.rowClickedEmitter.emit(this.expandedElement);
    }
  }

  public updateSubTable(expandedColumnsToDisplay: TableColumn[], expandedDataSource: ExpandedDataType[]){
    this.expandedColumnsToDisplay = expandedColumnsToDisplay;
    this.expandedDataSource = expandedDataSource;
  }

  
}
