import { NgFor } from '@angular/common';
import { AfterViewInit, Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { TableColumn } from '../../models/tableColumn';

@Component({
  selector: 'app-mat-table',
  standalone: true,
  imports: [MatTableModule, NgFor],
  templateUrl: './mat-table.component.html',
  styleUrl: './mat-table.component.scss'
})
export class MatTableComponent<TData> implements AfterViewInit{
  @Input({required: true}) dataSource!: TData[];
  @Input({required: true}) columnsToDisplay!: TableColumn[];
  internalColumnNames: string[] = [];

  ngAfterViewInit(): void {
    setInterval(() => this.internalColumnNames = this.columnsToDisplay.map((tableColumn) => tableColumn.internalName));
  }
}
