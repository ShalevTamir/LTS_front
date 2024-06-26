import { AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { mongoDBHandlerService } from './services/mongoDB-handler.service';
import {provideNativeDateAdapter} from '@angular/material/core';
import { NgFor, NgIf } from '@angular/common';
import { DataType } from './models/enums/data-type';
import { forIn } from 'lodash'
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DateTimeComponent } from "./components/date-time/date-time.component";
import { PaginatorComponent } from './components/paginator/paginator.component';
import { MatButton } from '@angular/material/button';
import { ArchiveData } from '../../common/models/custom-types';
import { FilteredFrameRos } from '../../common/models/ros/filtered-frame.ros';
import { MongoSensorAlertRos, MongoSensorAlertsRos } from './models/ros/mongo-sensor-alert.ros';
import { DataType as ArchiveDataType } from './models/enums/data-type';
import { MongoSensorAlert } from './models/mongo-sensor-alert';
import { SensorState } from '../live-parameters/models/enums/sensor-state.enum';
import { TelemetryParameterRos } from '../../common/models/ros/telemetry-parameter.ros';
import { ExpandableMatTableComponent } from '../../common/components/expandable-mat-table/expandable-mat-table.component';
import { TableColumn } from '../../common/components/expandable-mat-table/models/tableColumn';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface TimestampData{
  date: string,
  time: string,
  timestamp: number,
  expandable: boolean
}

type ExpandedDataType = MongoSensorAlert | TelemetryParameterRos;

@Component({
    selector: 'app-archive',
    standalone: true,
    animations: [
        trigger('detailExpand', [
            state('collapsed,void', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    templateUrl: './archive.component.html',
    styleUrl: './archive.component.scss',
    providers: [provideNativeDateAdapter()],
    imports: [NgFor, NgIf, ExpandableMatTableComponent, DateTimeComponent, PaginatorComponent, MatButton, MatProgressSpinnerModule]
})
export class ArchiveComponent implements AfterViewInit{
  @ViewChildren('btnDataType', { read: ElementRef }) dataTypeButtons!: QueryList<ElementRef>
  @ViewChild('fromDateTime', {static: true}) fromDatePicker!: DateTimeComponent;
  @ViewChild('toDateTime', {static: true}) toDatePicker!: DateTimeComponent;
  @ViewChild('paginator', {static: true}) paginator!: PaginatorComponent;
  @ViewChild('expandableTable', {static: true}) expandableTable!: ExpandableMatTableComponent<TimestampData, ExpandedDataType>;

  waitingForData: boolean = true;
  readonly defaultDataType: DataType = DataType.PARAMETERS;
  readonly defaultFromDate;
  readonly defaultToDate = new Date(Date.now());
  dataTypeEnum: [string, number][] = []
  selectedDataType: DataType = this.defaultDataType;
  expandableTableData: TimestampData[] = [];
  columnsToDisplay: TableColumn[] = [
    {displayName:'Date', internalName: 'date'},
    {displayName:'Time', internalName: 'time'}
  ];
  fetchedData: ArchiveData[] = [];

  constructor(private _mongoDBHandler: mongoDBHandlerService){
    this.defaultFromDate = new Date();
    this.defaultFromDate.setDate(this.defaultToDate.getDate() - 7);
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
    this.updatePageData();
  }  
  
  async handleDataTypeSelection(event: MouseEvent, dataTypeValue: DataType){
    this.paginator.resetPaginator();
    this.dataTypeButtons.forEach((button) => {
      this.removeBtnSelection(button.nativeElement);
    });
    let clickedButton = event.currentTarget as HTMLElement;
    this.applyBtnSelection(clickedButton);    
    this.selectedDataType = dataTypeValue;
    await this.updatePageData();
  }

  async handleRangeSubmit(){
    await this.updatePageData();
  }  
  
  protected async updatePageData(){
    this.waitingForData = true;
    await this.fetchData();
    this.waitingForData = false;
    this.updateTabularData();
    this.updateTotalPages();
  }
  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  protected handleRowClick(clickedElement: TimestampData){
    if (this.selectedDataType === ArchiveDataType.PARAMETERS){
      let clickedFrame: FilteredFrameRos = this.fetchedData.find((value) => value.TimeStamp === clickedElement.timestamp) as FilteredFrameRos;
      this.expandableTable.updateSubTable(
        [
          {displayName: 'Name', internalName: 'Name'},
          {displayName: 'Value', internalName: 'Value'},
          {displayName: 'Units', internalName: 'Units'}
        ],
        clickedFrame.Parameters)
    }
    else if(this.selectedDataType === ArchiveDataType.ALERTS){
      let clickedAlerts: MongoSensorAlertsRos = this.fetchedData.find((value) => value.TimeStamp === clickedElement.timestamp) as MongoSensorAlertsRos;
      
      this.expandableTable.updateSubTable(
        [
          {displayName: 'SensorName', internalName: 'sensorName'},
          {displayName: 'SensorStatus', internalName: 'sensorStatus'}
        ], 
      clickedAlerts.MongoAlerts.map((alert: MongoSensorAlertRos): MongoSensorAlert => {
        let strSensorStatus = SensorState[alert.SensorStatus];
        return {
        sensorName: alert.SensorName,
        sensorStatus: strSensorStatus.charAt(0).toLocaleUpperCase()+strSensorStatus.slice(1).toLowerCase()
      }})
      );
    }
  }

  protected epochToUTC(epochTime: number, isDate: boolean): string{
    var date = new Date(0);
    date.setMilliseconds(epochTime);
    return isDate ? date.toLocaleDateString() : date.toLocaleTimeString();
  }

  protected updateTabularData(){
    // this.expandableTable.updateData(this.fetchedData, this.selectedDataType);
    this.expandableTableData = [...new Set(this.fetchedData.map(
      (value) => {
        return {
          date: this.epochToUTC(value.TimeStamp, true),
          time: this.epochToUTC(value.TimeStamp, false),
          timestamp: value.TimeStamp,
          expandable: true
        }
      }))];
  }

  private async fetchData(){
    this.fetchedData = await this._mongoDBHandler.fetchData(
      this.selectedDataType,
      this.fromDatePicker.selectedDate.getTime(),
      this.toDatePicker.selectedDate.getTime(),
      this.paginator.maxSamples, 
      this.paginator.pageNumber);
  }    

  private async updateTotalPages(){
    let totalPages = await this._mongoDBHandler.countData(
      this.selectedDataType,
      this.fromDatePicker.selectedDate.getTime(),
      this.toDatePicker.selectedDate.getTime());
    this.paginator.totalPages = totalPages;
  }
  

  private applyBtnSelection(ref: HTMLElement){
    ref.classList.add('btn-selected');
  }
  private removeBtnSelection(ref: HTMLElement){
    ref.classList.remove('btn-selected');
  }
}
