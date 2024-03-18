import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]',
  standalone: true
})
export class DragAndDropDirective {
  @Output() filesDropped = new EventEmitter<File[]>();
  private readonly HOVER_CLASS_NAME = 'hover';

  constructor(private _elementRef: ElementRef<HTMLElement>) { }

  @HostListener('dragover', ['$event'])
  onDragOver(event: Event){
    event.preventDefault();
    event.stopPropagation();
    this._elementRef.nativeElement.classList.add(this.HOVER_CLASS_NAME);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: Event){
    event.preventDefault();
    event.stopPropagation();
    this._elementRef.nativeElement.classList.remove(this.HOVER_CLASS_NAME);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: any){
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if(files.length > 0){
      this.filesDropped.emit(files);
    }
  }
}
