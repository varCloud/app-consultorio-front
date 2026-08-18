import { Directive, AfterViewInit } from '@angular/core';
import feather from 'feather-icons';

@Directive({
    selector: '[appFeatherIcon]',
    standalone: false
})
export class FeatherIconDirective implements AfterViewInit {

  constructor() { }

  ngAfterViewInit() {
    // feather icon
    feather.replace();
  }

}
