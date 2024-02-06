import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTable, MatTableModule} from '@angular/material/table';
import { mongoDBHandlerService } from './services/mongoDB-handler.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepicker, MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { NgFor } from '@angular/common';
import { DataType } from './models/enums/data-type';
import { forIn } from 'lodash'
import { FilteredFrame } from '../../common/models/ros/filtered-frame.ros';
import { MongoSensorAlertsRos } from './models/ros/mongo-sensor-alert.ros';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [MatPaginatorModule, MatTableModule, MatFormFieldModule, MatDatepickerModule, MatInputModule, NgxMatTimepickerModule, FormsModule, MatButtonModule, NgFor],
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.scss',
  providers: [provideNativeDateAdapter()]
})
export class ArchiveComponent implements AfterViewInit{
  @ViewChild('table', {static: true}) table!: MatTable<any>;
  readonly defaultDataType: DataType;
  dataTypeEnum!: [string, number][]
  selectedFromDate!: Date 
  selectedToDate!: Date;
  maxSamples: number;
  pageNumber: number;
  selectedDataType: DataType;
  tableData: any[]
  columnsToDisplay= ['timestamp']
  
  @ViewChildren('btnDataType', { read: ElementRef }) dataTypeButtons!: QueryList<ElementRef>

  constructor(private _mongoDBHandler: mongoDBHandlerService){
    this.defaultDataType = DataType.PARAMETERS;
    this.maxSamples = 10;
    this.pageNumber = 0;
    this.selectedDataType = this.defaultDataType;
    this.dataTypeEnum = [];
    this.tableData = [];
    forIn(DataType, (key, value) => {
      if(typeof(key) === "string"){
        this.dataTypeEnum.push([key,+value]);
      }
    })
  }

  ngAfterViewInit(): void {
    this.applyBtnSelection(this.dataTypeButtons.find((button) =>{
      return (button.nativeElement as HTMLElement).innerText.toUpperCase() == DataType[this.defaultDataType]
    })?.nativeElement);
  }  
  
  handleDataTypeSelection(event: MouseEvent, dataTypeValue: DataType){
    this.dataTypeButtons.forEach((button) => {
      this.removeBtnSelection(button.nativeElement);
    });
    let clickedButton = event.currentTarget as HTMLElement;
    this.applyBtnSelection(clickedButton);    
    this.selectedDataType = dataTypeValue;
    console.log(this.selectedDataType);
  }

  handlePageEvent(event: PageEvent){
    this.maxSamples = event.pageSize;
    this.pageNumber = event.pageIndex;
  }

  async handleRangeSubmit(){
    let res: (FilteredFrame | MongoSensorAlertsRos)[] = await this._mongoDBHandler.fetchData(this.selectedDataType, this.selectedFromDate.getTime(), this.selectedToDate.getTime(), this.maxSamples, this.pageNumber);
    this.tableData = res.map((value) => value.TimeStamp);
    this.table.renderRows();
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

  private applyBtnSelection(ref: HTMLElement){
    ref.classList.add('btn-selected');
  }
  private removeBtnSelection(ref: HTMLElement){
    ref.classList.remove('btn-selected');
  }
}
