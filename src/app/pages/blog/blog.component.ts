import { Component } from '@angular/core';
import { ConfigurePiwikTracker, UsePiwikTracker } from 'angular2piwik';
import { AuthService } from '../auth/auth.service';


declare const $: any;
declare const jQuery: any;

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  providers:[ConfigurePiwikTracker,UsePiwikTracker]
})
export class BlogComponent {
  constructor(
    private configurePiwikTracker: ConfigurePiwikTracker,
    private usePiwikTracker: UsePiwikTracker,
    private authService: AuthService){

  }
  ngAfterViewInit() {
    $(window).load(() => {
      this.configurePiwikTracker.setDocumentTitle();
    if(this.authService.authenticated){
      console.log(this.authService.currentUser.email);
      this.configurePiwikTracker.setUserId(`"${this.authService.currentUser.email}"`);
      this.usePiwikTracker.trackPageView();
    }else {console.log("Not authenticated");
    this.usePiwikTracker.trackPageView();}
  });
}
}
