import { Component, Input } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [MatPaginator],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {
  @Input() disabled: boolean = false;
  maxSamples = 10;
  pageNumber = 0;
  totalPages = 0;
  length = 0;

  async handlePageEvent(event: PageEvent){
    this.maxSamples = event.pageSize;
    this.pageNumber = event.pageIndex;
    // this.updateTabularData();
  }

}
