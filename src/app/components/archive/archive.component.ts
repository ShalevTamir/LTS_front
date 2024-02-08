import { AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { mongoDBHandlerService } from './services/mongoDB-handler.service';
import {provideNativeDateAdapter} from '@angular/material/core';
import { NgFor } from '@angular/common';
import { DataType } from './models/enums/data-type';
import { forIn } from 'lodash'
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DateTimeComponent } from "./components/date-time/date-time.component";
import { PaginatorComponent } from './components/paginator/paginator.component';
import { ExpandableMatTableComponent } from './components/expandable-mat-table/expandable-mat-table.component';
import { MatButton } from '@angular/material/button';
import { ArchiveData } from '../../common/models/custom-types';

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
    imports: [NgFor, ExpandableMatTableComponent, DateTimeComponent, PaginatorComponent, MatButton]
})
export class ArchiveComponent implements AfterViewInit{
  @ViewChildren('btnDataType', { read: ElementRef }) dataTypeButtons!: QueryList<ElementRef>
  @ViewChild('fromDateTime', {static: true}) fromDatePicker!: DateTimeComponent;
  @ViewChild('toDateTime', {static: true}) toDatePicker!: DateTimeComponent;
  @ViewChild('paginator', {static: true}) paginator!: PaginatorComponent;
  @ViewChild('expandableTable', {static: true}) expandableTable!: ExpandableMatTableComponent;

  readonly defaultDataType: DataType = DataType.PARAMETERS;
  dataTypeEnum: [string, number][] = []
  selectedDataType: DataType = this.defaultDataType;
  expandableTableData: number[] = [];
  columnsToDisplay = ['timestamp'];
  fetchedData: ArchiveData[] = [];

  constructor(private _mongoDBHandler: mongoDBHandlerService){
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
  }

  async handleRangeSubmit(){
    await this.updatePageData();
  }  
  
  protected async updatePageData(){
    await this.fetchData();
    this.updateTabularData();
    this.updateTotalPages();
  }
  
  protected updateTabularData(){
    this.expandableTable.updateData(this.fetchedData, this.selectedDataType);
    this.expandableTableData = this.fetchedData.map((value) => {return value.TimeStamp});
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
