import { Component, ViewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { LIVE_DATA_URL, LIVE_TELE_URL } from '../../common/constants';
import { HttpClient } from '@angular/common/http';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { ExpandableMatTableComponent } from '../../common/components/expandable-mat-table/expandable-mat-table.component';
import { ParameterSensorRos } from './models/ros/parameter-sensor.ros';
import { NgIf } from '@angular/common';
import { requirementToString } from '../header/models/ros/base-requirement-ros';
import { durationToString } from '../header/models/ros/duration-ros';

interface ExpandableSensor{
  sensorName: string;
  validRequirement: string;
  warningRequirement: string;
  invalidRequirement: string;
}

interface ExpandedSensorRequirement{
  parameterName: string;
  requirement: string;
  duration: string;
}

@Component({
  selector: 'app-uploader',
  standalone: true,
  imports: [FileUploaderComponent, ExpandableMatTableComponent, NgIf],
  templateUrl: './requirements-uploader.component.html',
  styleUrl: './requirements-uploader.component.scss'
})
export class UploaderComponent {
  expandableColumnsToDisplay = ['sensorName', 'validRequirement', 'warningRequirement', 'invalidRequirement'];
  parsedSensors: ExpandableSensor[] = [];
  fetchedData: ParameterSensorRos[] = [];
  @ViewChild(ExpandableMatTableComponent) expandableTable!: ExpandableMatTableComponent<ExpandableSensor, ExpandedSensorRequirement>

  constructor(private _httpClient: HttpClient){}
  
  async handleFileSelectedAsync(file: File){
    const formData = new FormData();
    formData.append("file", file);
    this.fetchedData = await firstValueFrom(this._httpClient.post<ParameterSensorRos[]>(LIVE_TELE_URL+"/live-sensors/sensors-requirements", formData));
    this.parsedSensors = this.fetchedData.map((sensorRos): ExpandableSensor => {
      let [validRequirement, warningRequirement, invalidRequirement] = sensorRos.Requirements.map((requirement) => requirement.RequirementParam);
      return {
      sensorName: sensorRos.SensedParamName,
      validRequirement: requirementToString(validRequirement),
      warningRequirement: requirementToString(warningRequirement),
      invalidRequirement: requirementToString(invalidRequirement) 
    }}); 
  }

  handleRowClick(clickedElement: ExpandableSensor){
    let clickedSensor = this.fetchedData.find((parameterSensorRos) => parameterSensorRos.SensedParamName === clickedElement.sensorName) as ParameterSensorRos;
    this.expandableTable.updateSubTable(
      ['parameterName','requirement','duration'], 
      clickedSensor.AdditionalRequirements.map((sensorRequirementRos): ExpandedSensorRequirement => {
        return {
        parameterName: sensorRequirementRos.ParameterName,
        requirement: requirementToString(sensorRequirementRos.Requirement),
        duration: durationToString(sensorRequirementRos.Duration)
      }}));
  }

}
