import { Component, HostListener, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {BreakpointObserver} from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  title = 'fantasy-basketball-trade-tool';
  mode: 'desktop' | 'mobile' = 'desktop';

  constructor(private observer: BreakpointObserver, private http: HttpClient) {
  }

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 680px)']).subscribe((res) => {
      if (res.matches) {
        //this.sidenav.mode = 'over';
        this.mode = 'mobile'
       // this.sidenav.close();
      } else {
        //this.sidenav.mode = 'side';
        this.mode = 'desktop';
        //this.sidenav.open();
      }
    })
  }
}
