import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChartjsChartComponent } from './components/chartjs-chart/chartjs-chart.component';
import { ConfigChartType } from './components/chartjs-chart/models/config-chart-type.model';
import { GaugeChartComponent } from './components/gauge-chart/gauge-chart.component';
import { ChartMode } from './components/chartjs-chart/models/enums/chart-mode';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { ParametersConfigService } from '../../services/parameters-ranges.service';
import { LiveParametersSocketService } from '../../services/live-parameters-socket.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, MatIconModule, NgFor, NgIf, GaugeChartComponent, MatIconModule, ChartjsChartComponent, MatAutocompleteModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})

export class CardComponent implements OnInit{
  static readonly maxChartSamples: number = 60;
  @Input() parameterName: string = "Parameter Name";
  @Input() cardType: string = "chart";
  @Output() addCardEmitter: EventEmitter<string> = new EventEmitter();
  @ViewChild(ChartjsChartComponent) chartjs: ChartjsChartComponent | undefined;
  @ViewChild(GaugeChartComponent) gauge: GaugeChartComponent | undefined;
  chartTypes: string[] = Object.keys(ConfigChartType).filter(value => isNaN(Number(value)));
  selectedChartType: ConfigChartType = ChartjsChartComponent.defaultChartType;
  chartMode: ChartMode = ChartMode.NO_DATA;
  xAxisData: string[] = [];
  yAxisData: string[] = [];

  // add card
  formControl = new FormControl('');
  parametersNamesOptions: string[] = [];
  filteredOptions!: Observable<string[]>;
  displayAddCardButton: boolean = true;

  constructor(private _parametersConfigService: ParametersConfigService, private _liveParametersSocketService: LiveParametersSocketService){
  }

  ngOnInit(): void {
    this._parametersConfigService.getParameterNames().then((parameterNames: string[]) => this.parametersNamesOptions = parameterNames);
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterOptions(value || ''))
    );
  }

  protected async handleAddCard(selectEvent: MatAutocompleteSelectedEvent){
    let parameterName = selectEvent.option.value;
    await this._liveParametersSocketService.addParameter(parameterName);
    this.addCardEmitter.emit(parameterName);
    this.formControl.reset();
    this.displayAddCardButton = !this.displayAddCardButton;
  }

  private filterOptions(value: string): string[]{
    const filterValue = value.toLowerCase();
    return this.parametersNamesOptions.filter(option => option.toLowerCase().startsWith(filterValue));
  }

  
  changeChartType(updatedChartType: string){
    this.selectedChartType = ConfigChartType[updatedChartType as keyof typeof ConfigChartType];
 }
 

  private insertChartjsData(xData: string, yData:string){
    this.xAxisData.push(xData);
    this.yAxisData.push(yData);
    this.chartjs?.chart.update();
    if(this.xAxisData.length > CardComponent.maxChartSamples){
      this.xAxisData.shift();
      this.yAxisData.shift();
      this.chartjs?.chart.update();
    }
  }

  public updateChartValues(xData: string, yData: string){
    this.chartMode = ChartMode.HAS_DATA;
    setTimeout(() => {
      this.insertChartjsData(xData, yData);      
      if(this.gauge !== undefined){
        this.gauge.updateGaugeValue(+yData);
      }
    }, 1);
    
  }
}
