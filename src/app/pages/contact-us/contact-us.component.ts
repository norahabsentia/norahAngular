import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Http, RequestOptions, Headers, URLSearchParams} from '@angular/http'
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { ConfigurePiwikTracker, UsePiwikTracker } from 'angular2piwik';
import { AuthService } from '../auth/auth.service';
import "rxjs/Rx";

declare const $: any;
declare const jQuery: any;
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
  providers:[ConfigurePiwikTracker,UsePiwikTracker]
})
export class ContactUsComponent {
  @ViewChild('contactSuccessModal') public contactSuccessModal: ModalDirective;
  contactForm: FormGroup;
  public recipient: string;
  public subject: string;
  public message: string;
  

  constructor(  private configurePiwikTracker: ConfigurePiwikTracker,
    private usePiwikTracker: UsePiwikTracker,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private http: Http
  ) {
   
    this.contactForm = this.formBuilder.group({
      name: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      message: new FormControl(''),
    });
  }
  public send() {
    // console.log(this.contactForm.controls['name'].value);
    var body = {
        name: this.contactForm.controls['name'].value,
        email: this.contactForm.controls['email'].value,
        phone: this.contactForm.controls['phone'].value,
        text: this.contactForm.controls['message'].value   
      }
    $.post("https://absentiamailserver.herokuapp.com/mail", body, function(data) {
      if (data === 'ok') {
        alert("Thank You for contacting us!. We will get back to you soon."); 
        window.location.reload();
        // this.contactSuccessModal.show(); 
      }
  });
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
