import { Component, Input, ViewChild } from '@angular/core';
import { MatDatepicker, MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

@Component({
  selector: 'app-date-time',
  standalone: true,
  imports: [MatFormFieldModule, MatDatepickerModule, NgxMatTimepickerModule, MatInputModule],
  templateUrl: './date-time.component.html',
  styleUrl: './date-time.component.scss'
})
export class DateTimeComponent {
  @Input() startAtDate!: Date
  selectedDate!: Date;

  ngAfterViewInit(){
    this.selectedDate = this.startAtDate;
  }

  protected handleDateChange(event: MatDatepickerInputEvent<any>){
    this.selectedDate = event.value;
  }

  protected handleTimeChange(time: string){
    let [hours, minutes] = time.split(':');
    this.selectedDate.setHours(+hours);
    this.selectedDate.setMinutes(+minutes);
  }


}
