import { Component, OnInit } from '@angular/core';
import {TerrainGenService } from '../terrain-gen/terrain-gen.service';
import { ConfigurePiwikTracker, UsePiwikTracker } from 'angular2piwik';
import { AuthService } from '../auth/auth.service';


declare const $: any;
declare const jQuery: any;

@Component({
  selector: 'app-game-maker',
  templateUrl: './game-maker.component.html',
  styleUrls: ['./game-maker.component.css'],
  providers:[ConfigurePiwikTracker,UsePiwikTracker,TerrainGenService]
})
export class GameMakerComponent implements OnInit {
sideBarOpen:boolean=false;
  constructor(  private configurePiwikTracker: ConfigurePiwikTracker,
    private usePiwikTracker: UsePiwikTracker,
    private authService: AuthService) {  

     }

  ngOnInit() {
  }


  switchView(id:string){

     $("#main .content").each(function(value){
          $(this)[0].style.display="none";
          //console.log($(this));
     }); 
        console.log("id" +id);
    document.getElementById(id).style.display="block";

  }

  toggleSideBar(){
    if(this.sideBarOpen)
      this.closeNav()
    else
      this.openNav();

    this.sideBarOpen=!this.sideBarOpen;
  }

  offset:any="60px";
  /* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
 openNav() {
    document.getElementById("mySidenav").style.width = this.offset;
    document.getElementById("openbtn").style.marginLeft = this.offset;
    //document.getElementById("main").style.marginLeft = "300px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
 closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.getElementById("openbtn").style.marginLeft = "0";
    
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
