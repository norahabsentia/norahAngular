import { AfterViewInit, Component, Input, ViewEncapsulation } from '@angular/core';
import { GunInterpService } from './gun-gen.service';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { HeightMapSocketService } from './HeightMapSocketService';
import { GlobalRef } from '../../global-ref';
import * as firebase from 'firebase';
import { GunSocketService } from './gun-socket.service';
import { inputVal, outputVal } from './mock-data';  //dummy data
import { ConfigurePiwikTracker, UsePiwikTracker } from 'angular2piwik';
import { AuthService } from '../auth/auth.service';

declare var $: any;
declare const jQuery: any;
declare var ValidateInputsThenApply: any;


@Component({
  selector: 'app-gun-gen',
  templateUrl: './gun-gen.component.html',
  styleUrls: ['./gun-gen.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfigurePiwikTracker,UsePiwikTracker,GunSocketService, GunInterpService, HeightMapSocketService]
})
export class GunGenComponent implements AfterViewInit {

  currentComponent = 'mountains';
  activeLink = 'ActionRifle';
  isGenerate = false;
  isOpen = true;
  guns = [];
  selectedImgs = [];
  userTerrains: any;
  gunFiles = [];
  /* Received Data after clicking on button Upload */
  receivedData: any[] = [];
  showDeleteSelected = false;
  @Input() generationType: string;

  toastr: any;
  constructor(public gunGenService: GunInterpService,
    private http: Http,
    private socket: HeightMapSocketService,
    private global: GlobalRef,
    private gSocket: GunSocketService,
    private configurePiwikTracker: ConfigurePiwikTracker,
    private usePiwikTracker: UsePiwikTracker,
    private authService: AuthService
  ) {

    const wnd = this.global.nativeGlobal;
    this.toastr = wnd.toastr;

    this.gSocket.on("connection", () => {
      console.log("Connected");
      this.showToast("Socket connected");
    });

    this.gSocket.on("files", (data) => {

      console.log("Files received");
      console.log(data);

      this.showToast("Files received");
      this.gunFiles = data["files"];
      this.receivedData.push(this.gunFiles);
    });

    this.gSocket.on("errorInfo", (data) => {

      console.log(data);

      this.showToast("Info: " + data["msg"]);

    });
    //for gungenImages
    this.gSocket.on("imageFile", (d) => {
      console.log("ImageFile received");
      console.log(d);
      this.gunFiles = this.gunFiles.map((x) => {
        if (x.id == d.file.id)
        { return d.file } else { } return x
      });

      this.receivedData = this.receivedData.map((x) => {
        if ((x[0]).id != (this.gunFiles[0]).id)
          return x
        else
          return this.gunFiles
      });
    });

    this.gunGenService.isReady().subscribe(user => {

      if (user) {
        //this.getGuns(this.activeLink);
        console.log("calling nectTer" + user + "received");
        this.nextTerGan();
      }
    })

  }


  showToast(msg) {
    this.toastr.info(msg);
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
    this.getGuns(this.activeLink);

    this.socket.on('file-created', (msg) => {
      let item;
      const imgs = document.getElementById('accordion').getElementsByTagName('img');
      const imgList = [];
      for (let i = 0; i < imgs.length; i++) {
        if (imgs[i].src === msg.path) {
          item = imgs[i];
          break;
        }
      }
      if (item) {
        item.src = msg.path;
      }
    });
    this.nextTerGan();
  }
  getGuns(type: string) {
    console.log("GFetting guns " + type);
    this.gunGenService.getGuns(type)
      .then(data => {
        console.log('DATAAAAA');
        console.log(data);
        this.guns=[];
        data.map(res => {
          this.guns.splice(this.guns.length,-1,{isSelect:false, url:res})
        })
        // this.guns = data;
      })
      .catch(error => console.log(error));
  }

  selectGun(type: string) {
    this.activeLink = type;
    this.getGuns(type);
  }
  imageLoaded(event) {
    event.target.style.visibility = 'visible';
  }


  errorImage(event) {
    event.target.style.visibility = 'hidden';
    this.socket.emit('watch', { path: event.target.src });
  }

  nextTerGan() {
    console.log("getting library");
    console.log(this.gunGenService.user);
    this.gunGenService.getGunsFromLibrary('mountains')
      .subscribe(items => {
        const itemsArr = [];
        items.forEach((item) => {
          itemsArr.push(firebase
            .storage()
            .ref(`gunImages/${item.type}/`)
            .child(`${item.name}`)
            .getDownloadURL()
            .then(data => {
              item["imgsrc"] = data;
              //console.log(item);
              return item;
            }).catch(e => console.log(e))
          );
        });
        Promise.all(itemsArr).then((d) => { this.userTerrains = d; console.log(d) });
        console.log('userTerrains',this.userTerrains);
      });
    //this.isGenerate = !this.isGenerate;
    console.log(this.isGenerate);
  }

  showHideSidePane() {
    this.isGenerate = !this.isGenerate;
    console.log("Switching Side panes");

  }

  isOpenAccord() {
    this.isOpen = !this.isOpen;

  }

  changeBorder = function (index) {
    this.guns[index].isSelect = !this.guns[index].isSelect;
    // this.selected = index;
  }

  deleteFromLibrary(terrain) {
    console.log(terrain);

    this.userTerrains = this.userTerrains.filter((x) => x.$key != terrain.$key);
    this.gunGenService.removeGunFromLibrary(terrain.$key);
    /*this.gunGenService.getGunsFromLibrary('mountains')
      .subscribe(items => {
        for ( const item of items ) {
          if ( (item as any ).type === 'mountains' && (item as any).name === terrain.match(/%2F(.+)\?/)[1] ) {
            this.gunGenService.removeTerrainsFromLibray((item as any).$key);
          }
        }
      });
      */
  }

  addToLibraryFromGeneration(receivedImg) {
    const recived = receivedImg.split('/');

    fetch(receivedImg)
      .then(res => res.blob()) // Gets the response and returns it as a blob
      .then(blob => {
        const objectURL = URL.createObjectURL(blob);
        const storageRef = firebase.storage().ref();
        const path = `/mountains/${recived[recived.length - 1]}`;
        const iRef = storageRef.child(path);
        iRef.put(blob).then((snapshot) => {
          const terrainObj = {
            type: 'mountains',
            name: recived[recived.length - 1]
          };
          this.gunGenService.addTerrain(terrainObj);
        });
      });
  }

  /* Add terrain to db */
  addToLibrary(terrain: any) {
    //console.log('terrain',terrain, terrain.url.match(/%2F(.+)\?/)[1].split('%2F')[1]);
    const terrainName = terrain.url.match(/%2F(.+)\?/)[1].split('%2F')[1];
    const terrainObj = {
      type: this.activeLink,
      name: terrainName,
      src: terrain.url
    };
    console.log(terrainObj);
    this.gunGenService.addTerrain(terrainObj);
  }

  addToGame(gun: string) {
    console.log(gun);
    const gunName = gun.match(/%2F(.+)\?/)[1];
    const gunObj = {
      type: this.activeLink,
      name: gunName,
      src: gun
    };
    this.gunGenService.addGunToGame(gunObj);
  }

  openImage(src) {
    console.log('SRC' + src);
    ValidateInputsThenApply(src);
  }

  clearCheckImages() {

    this.selectedImgs = [];
    this.userTerrains.forEach((item) => item.selected = false);

  }

  uploadImages(p_cross) {
    const wnd = this.global.nativeGlobal;
    const toastr = wnd.toastr;


    if (this.selectedImgs.length < 2) {
      toastr.error('Select atleast 2 Imagemaps for generate');
      return;

    }
    if (this.selectedImgs.length > 2) {
      toastr.error('Select only 2 Imagemaps for hybrid generate');
      return;

    }



    this.toastr.info("Downloading guns Json")
    this.gunGenService.getGunJson(this.selectedImgs[0], this.selectedImgs[1]).then(val => {

      console.log("JSON VALUES DOWNLOAED");
      this.toastr.info("Generating gun Models");
      console.log(val);
      this.generateGun(val[0], val[1]);
    }).catch((err) => {
      console.log("Failed to download JSONS");
      this.toastr.error("Failed to download guns Json.")

    })
    this.clearCheckImages();

  }

  selectImg(event, gun) {
    event.stopPropagation();
    event.preventDefault();
    gun.selected = !gun.selected;
    this.selectedImgs = this.userTerrains.filter((item) => item.selected);
  }

  deleteSelected() {
    this.gunGenService.getGunsFromLibrary('mountains')
      .subscribe(items => {
        for (const item of items) {
          for (const selected of this.selectedImgs) {
            if ((item as any).type === 'mountains' && (item as any).name === selected.match(/%2F(.+)\?/)[1]) {
              this.gunGenService.removeTerrainsFromLibray((item as any).$key);
            }
          }
        }
        this.selectedImgs = [];
      });
  }


  generateGun(inval, outval) {
    console.log("sending files");
    this.gSocket.emit("upload", { inputValues: inval, outputValues: outval });

  }

}
