import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import { mongoDBHandlerService } from './services/mongoDB-handler.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [MatPaginatorModule, MatTableModule, MatFormFieldModule, MatDatepickerModule, MatInputModule],
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.scss',
  providers: [provideNativeDateAdapter()]
})
export class ArchiveComponent implements OnInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  readonly defaultMaxSamples: number = 10;

    

  ngOnInit(){
    console.log()
  }

  handlePageEvent(event: PageEvent){
    console.log(event);
  }
}
