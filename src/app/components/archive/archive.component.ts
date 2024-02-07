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
import { MatIconModule } from '@angular/material/icon';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TelemetryParameter } from '../../common/models/ros/telemetry-parameter.ros';
import { MongoSensorAlert } from './models/mongo-sensor-alert';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [MatPaginatorModule, MatTableModule, MatFormFieldModule, MatDatepickerModule, MatInputModule, NgxMatTimepickerModule, FormsModule, MatButtonModule, NgFor, MatIconModule],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.scss',
  providers: [provideNativeDateAdapter()]
})
export class ArchiveComponent implements AfterViewInit{
  @ViewChild('expandableTable', {static: true}) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChildren('btnDataType', { read: ElementRef }) dataTypeButtons!: QueryList<ElementRef>
  readonly defaultDataType: DataType;
  dataTypeEnum!: [string, number][]
  selectedFromDate!: Date 
  selectedToDate!: Date;
  maxSamples: number;
  pageNumber: number;
  selectedDataType: DataType;
  expandableTableData: number[];
  expandedTableData: (TelemetryParameter | MongoSensorAlert)[];
  columnsToDisplay;
  columnsToDisplayWithExpand;
  totalPages!: number;
  expandedElement!: number | null;
  fetchedData: (FilteredFrame | MongoSensorAlertsRos)[];
  expandedColumnsToDisplay: string[];

  

  constructor(private _mongoDBHandler: mongoDBHandlerService){
    this.defaultDataType = DataType.PARAMETERS;
    this.maxSamples = 10;
    this.pageNumber = 0;
    this.totalPages = 0;
    this.selectedDataType = this.defaultDataType;
    this.dataTypeEnum = [];
    this.expandableTableData = [];
    this.expandedTableData = [];
    this.columnsToDisplay = ['timestamp'];
    this.columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
    this.fetchedData = [];
    this.expandedColumnsToDisplay = ['name', 'value', 'units'];
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

  async handlePageEvent(event: PageEvent){
    this.maxSamples = event.pageSize;
    this.pageNumber = event.pageIndex;
    this.updateTabularData();
  }

  async handleRangeSubmit(){
    this.updateTabularData();
    this.updateTotalPages();
  }

  handleRowClick(clickedTimestamp: number){
    this.updateExpandedData(clickedTimestamp);
    this.expandedElement = this.expandedElement === clickedTimestamp ? null : clickedTimestamp
  }

  epochToUTC(epochTime: number){
    var date = new Date(0);
    date.setMilliseconds(epochTime);
    return date.toLocaleDateString()+" "+date.toLocaleTimeString();
  }

  private updateExpandedData(clickedTimestamp: number){
    let clickedDataSample: FilteredFrame | MongoSensorAlertsRos = 
      this.fetchedData.find((value) => value.TimeStamp == clickedTimestamp) as FilteredFrame | MongoSensorAlertsRos;
    if(clickedDataSample instanceof FilteredFrame){
      this.expandedTableData = clickedDataSample.Parameters;
    }
  }

  private async updateTabularData(){
    this.fetchedData = await this._mongoDBHandler.fetchData(this.selectedDataType, this.selectedFromDate.getTime(), this.selectedToDate.getTime(), this.maxSamples, this.pageNumber);
    this.expandableTableData = this.fetchedData.map((value) => {
      return value.TimeStamp;
    });
    
    this.table.renderRows();
  }

  private async updateTotalPages(){
    this.totalPages = await this._mongoDBHandler.countData(this.selectedDataType, this.selectedFromDate.getTime(), this.selectedToDate.getTime());
    // this.paginator.length = this.totalPages;
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
