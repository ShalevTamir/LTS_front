import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { LIVE_DATA_URL, LIVE_TELE_URL } from '../../common/constants';
import { HttpClient } from '@angular/common/http';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { ExpandableMatTableComponent } from '../../common/components/expandable-mat-table/expandable-mat-table.component';
import { ParameterSensorRos } from './models/ros/parameter-sensor.ros';
import { NgIf } from '@angular/common';
import { requirementToString } from '../header/models/ros/base-requirement-ros';
import { durationToString } from '../header/models/ros/duration-ros';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TableColumn } from '../../common/components/expandable-mat-table/models/tableColumn';

interface ExpandableSensor{
  sensorName: string;
  validRequirement: string;
  warningRequirement: string;
  invalidRequirement: string;
  expandable: boolean;
}

interface ExpandedSensorRequirement{
  parameterName: string;
  requirement: string;
  duration: string;
}

@Component({
  selector: 'app-uploader',
  standalone: true,
  imports: [FileUploaderComponent, ExpandableMatTableComponent, NgIf, MatProgressSpinner],
  templateUrl: './requirements-uploader.component.html',
  styleUrl: './requirements-uploader.component.scss'
})
export class UploaderComponent {
  expandableColumnsToDisplay: TableColumn[] = [
    {displayName: 'Sensor Name', internalName: 'sensorName'},
    {displayName: 'Valid Requirement', internalName: 'validRequirement'},
    {displayName: 'Warning Requirement', internalName: 'warningRequirement'},
    {displayName: 'Invalid Requirement', internalName: 'invalidRequirement'}
  ];
  parsedSensors: ExpandableSensor[] = [];
  fetchedData: ParameterSensorRos[] = [];
  showProgressSpinner = false;
  @ViewChild(ExpandableMatTableComponent) expandableTable!: ExpandableMatTableComponent<ExpandableSensor, ExpandedSensorRequirement>

  constructor(private _httpClient: HttpClient, private _changeDetector: ChangeDetectorRef){}
  
  async handleFileSelectedAsync(file: File){
    this.showProgressSpinner = true;
    this._changeDetector.detectChanges();
    const formData = new FormData();
    formData.append("file", file);
    this.fetchedData = await firstValueFrom(this._httpClient.post<ParameterSensorRos[]>(LIVE_TELE_URL+"/live-sensors/sensors-requirements", formData));
    this.showProgressSpinner = false;
    this.parsedSensors = this.fetchedData.map((sensorRos): ExpandableSensor => {
      let [validRequirement, warningRequirement, invalidRequirement] = sensorRos.Requirements.map((requirement) => requirement.RequirementParam);
      return {
      sensorName: sensorRos.SensedParamName,
      validRequirement: requirementToString(validRequirement),
      warningRequirement: requirementToString(warningRequirement),
      invalidRequirement: requirementToString(invalidRequirement), 
      expandable: sensorRos.AdditionalRequirements.length > 0
    }}); 
  }

  handleRowClick(clickedElement: ExpandableSensor){
    let clickedSensor = this.fetchedData.find((parameterSensorRos) => parameterSensorRos.SensedParamName === clickedElement.sensorName) as ParameterSensorRos;
    this.expandableTable.updateSubTable(
      [
        {displayName: 'Parameter Name', internalName: 'parameterName'},
        {displayName: 'Requirement', internalName: 'requirement'},
        {displayName: 'Duation', internalName: 'duration'}
      ], 
      clickedSensor.AdditionalRequirements.map((sensorRequirementRos): ExpandedSensorRequirement => {
        return {
        parameterName: sensorRequirementRos.ParameterName,
        requirement: requirementToString(sensorRequirementRos.Requirement),
        duration: durationToString(sensorRequirementRos.Duration)
      }}));
  }

}
