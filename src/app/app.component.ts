import { AfterViewInit, Component, Inject } from '@angular/core';
import { dashCaseToCamelCase } from '@angular/platform-browser/src/dom/util';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthService } from './pages/auth/auth.service';
import { LibraryService } from './pages/library/library.service';
import { RepositoryService } from './pages/repository/repository.service';
import { InitializePiwik,ConfigurePiwikTracker, UsePiwikTracker} from 'angular2piwik';


declare const $: any;
declare const jQuery: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers:[InitializePiwik,ConfigurePiwikTracker,UsePiwikTracker]
})
export class AppComponent implements AfterViewInit {
  tags = [];
  showFilters: boolean;
  updateIndex: boolean;
  hideFooter: boolean;
  myLibrary: boolean;
  userAuthorized: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(     private configurePiwikTracker: ConfigurePiwikTracker,
    private usePiwikTracker: UsePiwikTracker,private initializePiwik: InitializePiwik,private router: Router, private authService: AuthService,
              private repService: RepositoryService, private libService: LibraryService) {
                 // set your url to whatever should be communicating with Piwik with the correct backslashes
                
                if (window.location.href.indexOf("norah.ai") > -1) {
                  console.log("You are at Norah.ai");
                  const url = `//piwik.norah.ai/`;
                  initializePiwik.init(url,1);
              } else {
                console.log("You are NOT at Norah.ai");
                const url = `//35.197.139.9/`;     
                  initializePiwik.init(url,2);
              }

      if(this.authService.authenticated){
        console.log(this.authService.currentUser.email);
        this.configurePiwikTracker.setUserId(`"${this.authService.currentUser.email}"`);
       
      }else {console.log("Not authenticated");} 
  
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showFilters = event.url.indexOf('repository') !== -1 || event.url.indexOf('my-library') !== -1;
        this.myLibrary = event.url.indexOf('my-library') !== -1;
        this.updateIndex = event.url.indexOf('auto-rigger') !== -1 || event.url.indexOf('motion-editor') !== -1;
        this.hideFooter = event.url.indexOf('auto-rigger') !== -1 || event.url.indexOf('motion-editor') !== -1 ||
          event.url.indexOf('style-transfer-tool') !== -1;
      }
  
    });
    repService.selectedTags$
      .subscribe((tag: string) => {
        this.tags.push(tag);
      });
  }
 
  checkLogin(url: string): void {
    if (this.authService.authenticated) {
     
      this.router.navigate([url]);
    } else {
      this.userAuthorized.next(true);
    }
    return;
  }
  removeTag(tag) {
    this.tags.splice(this.tags.indexOf(tag), 1);
    this.repService.removeTagFromPanel(tag);
  }
  deleteSelected($event) {
    this.libService.removeAnimationEvent($event);
  }

  ngAfterViewInit() {
    $(window).load(() => {
      ($('.sf-menu') as any).superfish();
     // console.log(this.authService.currentUser.email);
    });
  }
}
