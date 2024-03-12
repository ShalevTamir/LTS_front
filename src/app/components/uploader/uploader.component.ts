import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { LIVE_DATA_URL, LIVE_TELE_URL } from '../../common/constants';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-uploader',
  standalone: true,
  imports: [],
  templateUrl: './uploader.component.html',
  styleUrl: './uploader.component.scss'
})
export class UploaderComponent {
  constructor(private _httpClient: HttpClient){

  }
  async onFileSelected(event: any){
    const file: File = event.target.files[0];
    if(file){
      const formData = new FormData();
      formData.append("file", file);
      console.log(await firstValueFrom(this._httpClient.post(LIVE_TELE_URL+"/live-sensors/sensors-requirements", formData)));
    }
  }

}
