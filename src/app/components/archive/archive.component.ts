import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import { mongoDBHandlerService } from './services/mongoDB-handler.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepicker, MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [MatPaginatorModule, MatTableModule, MatFormFieldModule, MatDatepickerModule, MatInputModule, NgxMatTimepickerModule, FormsModule],
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.scss',
  providers: [provideNativeDateAdapter()]
})
export class ArchiveComponent implements OnInit{
  readonly defaultMaxSamples: number = 10;
  selectedFromDate!: Date 
  selectedToDate!: Date;
  maxSamples: number = this.defaultMaxSamples;
  pageNumber: number = 0;
  

  constructor(private _mongoDBHandler: mongoDBHandlerService){
    
  }

  ngOnInit(){
  }

  handlePageEvent(event: PageEvent){
    this.maxSamples = event.pageSize;
    this.pageNumber = event.pageIndex;
  }

  async handleRangeSubmit(){
    let res = await this._mongoDBHandler.fetchFrames(this.selectedFromDate.getTime(), this.selectedToDate.getTime(), this.maxSamples, this.pageNumber);
    console.log(res);
  }

  handleFromDateChange(event: MatDatepickerInputEvent<any>){
    this.selectedFromDate = event.value;
  }

  handleToDateChange(event: MatDatepickerInputEvent<any>){
    this.selectedToDate = event.value;    
  }

  handleTimeChange(time: string, fromOrTo: string){
    let dateToChange = fromOrTo == 'from' ? this.selectedFromDate : this.selectedToDate;   
    let [hours, minutes] = time.split(':');
    dateToChange.setHours(+hours);
    dateToChange.setMinutes(+minutes);
  }


}
