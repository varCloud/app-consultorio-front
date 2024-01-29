import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { ObservableService } from 'src/app/utils/observable.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  isLoading: boolean;
  _loadingSubscriptor : Subscription;

  constructor(private router: Router,
    private loadingService: ObservableService) { 

    // Spinner for lazyload modules
    router.events.subscribe((event) => { 
      if (event instanceof RouteConfigLoadStart) {
        console.log("loadStar" , event)
        this.isLoading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        console.log("loadEnd" , event)
        this.isLoading = false;
      }
    });
  }

  ngOnInit(): void {
    // this.loadingService.isLoading.subscribe(data=>{
    //    this.isLoading = data;
    //  },error=>{
    //    console.log(error);
    //  })
  }

  OnDestroy(){
    // console.log("on destroy")
    // this._loadingSubscriptor.unsubscribe();
  }





}
