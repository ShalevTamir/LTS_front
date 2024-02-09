import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { FilterColumnsPipe } from "./pipes/filter-columns-pipe";
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ArchiveData } from '../../../../common/models/custom-types';
import { MatTableComponent } from "./components/mat-table/mat-table.component";
import { FilteredFrame } from '../../../../common/models/ros/filtered-frame.ros';
import { MongoSensorAlertsRos } from '../../models/ros/mongo-sensor-alert.ros';
import { DataType as ArchiveDataType } from '../../models/enums/data-type';
import { MongoSensorAlert } from '../../models/mongo-sensor-alert';

@Component({
    selector: 'app-expandable-mat-table',
    standalone: true,
    templateUrl: './expandable-mat-table.component.html',
    styleUrl: './expandable-mat-table.component.scss',
    animations: [
        trigger('detailExpand', [
            state('collapsed,void', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    imports: [MatTableModule, NgFor, MatIcon, NgIf, FilterColumnsPipe, MatButtonModule, MatTableComponent]
})
export class ExpandableMatTableComponent implements AfterViewInit{
  @ViewChild('table', {static: true}) matTable!: MatTable<any>;
  @Input({required: true}) dataSource!: number[];
  @Input({required: true}) columnsToDisplay!: string[];
  fetchedData: ArchiveData[] = [];
  dataType!: ArchiveDataType;
  expandedElement!: number | null;
  expandColumnDef = 'expand';
  expandedDetailDef = 'expandedDetail'
  expandedDataSource: unknown[] = [];
  expandedColumnsToDisplay: string[] = [];
  
  ngAfterViewInit(){
    setTimeout(() => {
      this.columnsToDisplay.unshift(this.expandColumnDef);
    });
  }

  public updateData(fetchedData: ArchiveData[], dataType: ArchiveDataType){
    this.fetchedData = fetchedData;
    this.dataType = dataType;
  }

  public renderRows(){
    this.matTable.renderRows();
  }

  protected handleRowClick(clickedTimeStamp: number){
    this.expandedElement = this.expandedElement === clickedTimeStamp ? null : clickedTimeStamp
    this.updateSubTable(clickedTimeStamp);
  }

  protected epochToUTC(epochTime: number, isDate: boolean){
    var date = new Date(0);
    date.setMilliseconds(epochTime);
    return isDate ? date.toLocaleDateString() : date.toLocaleTimeString();
  }

  private updateSubTable(clickedTimestamp: number){
    if (this.dataType === ArchiveDataType.PARAMETERS){
      this.expandedColumnsToDisplay = ['Name', 'Value', 'Units'];
      let clickedFrame: FilteredFrame = this.fetchedData.find((value) => value.TimeStamp == clickedTimestamp) as FilteredFrame;
      this.expandedDataSource = clickedFrame.Parameters;
    }
    else if(this.dataType === ArchiveDataType.ALERTS){
      this.expandedColumnsToDisplay = ['sensorName', 'sensorStatus']
      let clickedAlerts: MongoSensorAlertsRos[] = this.fetchedData.filter((value) => value.TimeStamp == clickedTimestamp) as MongoSensorAlertsRos[];
      console.log(clickedAlerts);
      this.expandedDataSource = clickedAlerts.map((alert: MongoSensorAlertsRos): MongoSensorAlert => {
        return {
        sensorName: alert.SensorName,
        sensorStatus: alert.SensorStatus
      }});
    }
  }
}
