import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-mat-table',
  standalone: true,
  imports: [MatTableModule, NgFor],
  templateUrl: './mat-table.component.html',
  styleUrl: './mat-table.component.scss'
})
export class MatTableComponent<TData> {
  @Input({required: true}) dataSource!: TData[];
  @Input({required: true}) columnsToDisplay!: string[];
}
