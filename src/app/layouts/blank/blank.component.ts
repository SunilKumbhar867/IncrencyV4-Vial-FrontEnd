import { Component } from '@angular/core';
import {  ElementRef, Renderer } from '@angular/core';

@Component({
  selector: 'blank-layout',
  templateUrl: './blank.component.html',
  styleUrls: []
})
export class BlankComponent {
  constructor(el: ElementRef, renderer: Renderer ){
    var events = 'cut copy paste';
    events.split(' ').forEach(e =>
    renderer.listen(el.nativeElement, e, (event) => {
      event.preventDefault();
      })
    );
  }
}
