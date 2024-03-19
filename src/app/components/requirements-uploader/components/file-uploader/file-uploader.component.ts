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
  @Output() onFileSelectedEmitter = new EventEmitter<File[]>();
  acceptableExtentions = ['pdf', 'docx'];

  async onFileSelected(files: File[] | FileList){
    if(files instanceof FileList){
      let arrFiles: File[] = [];
      for(let i=0; i<files.length; i++){
        arrFiles.push(files.item(i) as File);
      }
      files = arrFiles;
    }
    if(files.length){
      this.onFileSelectedEmitter.emit(files);
    }
  }

  protected formatedExtentions(){
    return this.acceptableExtentions.map(extention => '.' + extention);
  }

  protected uppercaseExtentions(){
    return this.acceptableExtentions.map(extention => extention.toUpperCase());
  }

  protected preventEventPropagation(event: Event): void{
    event.preventDefault();
    event.stopPropagation();
  }
} 
