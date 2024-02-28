import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [MatPaginator, NgIf],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() disabled: boolean = false;
  @Output() pageEvent = new EventEmitter();
  maxSamples = 10;
  pageNumber = 0;
  totalPages = 0;

  handlePageEvent(event: PageEvent){
    this.maxSamples = event.pageSize;
    this.pageNumber = event.pageIndex;
    this.pageEvent.emit();
  }

  resetPaginator(){
    this.paginator.firstPage();
  }

  

}
