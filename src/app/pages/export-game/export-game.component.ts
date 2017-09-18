import { Component } from '@angular/core';
import { LibraryService } from './library.service';
import {
  GlobalRef
} from '../../global-ref';

import { ConfigurePiwikTracker, UsePiwikTracker } from 'angular2piwik';
import { AuthService } from '../auth/auth.service';


declare const $: any;
declare const jQuery: any;

@Component({
  selector: 'export-game',
  templateUrl: './export-game.component.html',
  styleUrls: ['./export-game.component.scss'],
  providers:[LibraryService,ConfigurePiwikTracker,UsePiwikTracker]
})
export class ExportGameComponent {

  charModels:any=[];
  terrainModels:any=[];
  gunModels:any=[];
  selectedModelType:string="charModel"
  toastr:any;
  constructor( private configurePiwikTracker: ConfigurePiwikTracker,
    private usePiwikTracker: UsePiwikTracker,
    private authService: AuthService,private library:LibraryService,private global: GlobalRef) {

    const wnd = this.global.nativeGlobal;
    this.toastr = wnd.toastr;


    library.isLoggedIn().subscribe((user)=>{

        if(user)
          { this.toastr.info("Loading...");
             library.getCharModels().subscribe((d)=>{

              this.charModels=d;
                this.switchModelType(this.selectedModelType);
              document.getElementById("c").click();  //click on a tab to force view Update
              });

            library.getTerrainModels().subscribe((d)=>{
              this.terrainModels=d;
            });
            library.getGunModels().subscribe((d)=>{


              this.gunModels=d;
            });
          }
      else{
              //this.toastr.error("You need to login..");
    }
    });
      }

  switchModelType(modelType:string){
    console.log("switching...");
    this.selectedModelType=modelType;
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