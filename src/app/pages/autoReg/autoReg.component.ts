import { Component } from '@angular/core';
import { ConfigurePiwikTracker, UsePiwikTracker } from 'angular2piwik';
import { AuthService } from '../auth/auth.service';
import * as firebase from 'firebase';
import { GlobalRef } from '../../global-ref';
import { Http, Headers, Response  } from '@angular/http';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


declare const $: any;
declare const jQuery: any;

@Component({
  selector: 'app-autoReg,http-app',
  templateUrl: './autoReg.component.html',
  providers:[ConfigurePiwikTracker,UsePiwikTracker]
})

export class AutoRegComponent {
root = 0;

public html : any = "";
  constructor(
    private configurePiwikTracker: ConfigurePiwikTracker,
    private usePiwikTracker: UsePiwikTracker,
    private authService: AuthService,private global: GlobalRef,
    private http: Http,
    private router: Router
    ){
      
    }
  }
