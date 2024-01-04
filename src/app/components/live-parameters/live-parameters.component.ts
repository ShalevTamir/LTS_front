import { Component } from '@angular/core';
import { CardComponent } from './components/card/card.component';

@Component({
  selector: 'app-live-parameters',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './live-parameters.component.html',
  styleUrl: './live-parameters.component.scss'
})
export class LiveParametersComponent {

}
