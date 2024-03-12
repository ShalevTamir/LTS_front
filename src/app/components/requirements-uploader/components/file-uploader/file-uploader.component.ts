import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { LIVE_TELE_URL } from '../../../../common/constants';

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss'
})
export class FileUploaderComponent {
  @Output() onFileSelectedEmitter = new EventEmitter<File>();

  async onFileSelected(event: any){
    const file: File = event.target.files[0];
    if(file){
      this.onFileSelectedEmitter.emit(file);
    }
  }
} 
