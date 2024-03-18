import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { LIVE_TELE_URL } from '../../../../common/constants';
import { DragAndDropDirective } from './directives/drag-and-drop.directive';

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [DragAndDropDirective],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss'
})
export class FileUploaderComponent {
  @Output() onFileSelectedEmitter = new EventEmitter<File>();
  acceptableExtentions = ['pdf', 'docx'];

  async onFileSelected(files: File[]){
    
    if(files.length){
      this.onFileSelectedEmitter.emit(files[0]);
    }
  }

  protected formatedExtentions(){
    return this.acceptableExtentions.map(extention => '.' + extention);
  }

  protected uppercaseExtentions(){
    return this.acceptableExtentions.map(extention => extention.toUpperCase());
  }
} 
