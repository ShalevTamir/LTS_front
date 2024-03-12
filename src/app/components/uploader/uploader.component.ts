import { Component } from '@angular/core';

@Component({
  selector: 'app-uploader',
  standalone: true,
  imports: [],
  templateUrl: './uploader.component.html',
  styleUrl: './uploader.component.scss'
})
export class UploaderComponent {
  onFileSelected(event: Event){
    console.log(typeof(event));
  }

}
