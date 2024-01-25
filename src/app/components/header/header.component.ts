import { Component, Input } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { seperateString } from '../../common/utils/string-utils';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgbModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  title: string = ""
  constructor(private router: Router){
    this.router.events.subscribe((event: any) =>{
      if(event instanceof RoutesRecognized){
        let eventUrl: string = event.url;
        this.title = seperateString(eventUrl.substring(1), '-');
      }
    });
  }

}
