import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {HttpModule, Http,Response,Headers,RequestOptions, Request, RequestMethod, URLSearchParams} from '@angular/http';

import { Enemies } from './../../enemies';
import { Npcs } from './../../npcs';
import { ConfigurePiwikTracker, UsePiwikTracker } from 'angular2piwik';
import { AuthService } from '../auth/auth.service';


declare const $: any;
declare const jQuery: any;

@Component({
  selector: 'app-sniper',
  templateUrl: './sniper.component.html',
  styleUrls: ['./sniper.component.css'],
  providers:[ConfigurePiwikTracker,UsePiwikTracker]
})
export class SniperComponent implements OnInit {
  gameDataForm: FormGroup;
  data: any;

  someURL:string;
  companyName:any;
  gameName:any;
  bundleIdentifier:any;
  versionCode:any;
  versionNumber:any;
  appIconFile:any;
  exportForAndroid:any;
  exportForIos:any;
  exportForWebGl:any;

  sceneHeightMapFile:any;
  textureTileSizeY:any;
  textureTileSizeX:any;

  VR:any;
 
  playerPrefabName:any;
  playerPositionIndex:any;
  playerPowerLeg:any;
  playerPowerBody:any;
  playerPowerHead:any;

  gunModelFile:any;
  gunTextureFile:any;
  gunHeightmapFile:any;
  fireAnimationFile:any;
  recoilAnimationFile:any;
  fireSoundFile:any;
  recoilSoundFile:any;
  range:any;
  maxAngle:any;
  zoomScope:any;
  reloadTime:any;
  magSize:any;

  guid:any;
  enemies: Enemies[]= [];
  npcs: Npcs[]= [];

  constructor(     private configurePiwikTracker: ConfigurePiwikTracker,
    private usePiwikTracker: UsePiwikTracker,
    private authService: AuthService,private formBuilder: FormBuilder,private http:Http) { 
     

    //Initi values to the hardcoded vars
    this.someURL="https://www.akashpaul.com";

    this.companyName="AbsentiaVR";
    this.gameName="SniperBuilder";
    this.bundleIdentifier="com.absentia.sniper3d";
    this.versionCode="Test Run";
    this.versionNumber="1";
    this.appIconFile="https://firebasestorage.googleapis.com/v0/b/norahanimation.appspot.com/o/gameAssets%2Ficon.png?alt=media&token=c584f865-70e5-41b4-9a1f-ec0a86c52b74";
    this.exportForAndroid="true";
    this.exportForIos="false";
    this.exportForWebGl="true";
  
    this.sceneHeightMapFile="https://firebasestorage.googleapis.com/v0/b/norahanimation.appspot.com/o/gameAssets%2FGrass.jpg?alt=media&token=ac3b9acd-fc06-48f9-9e07-ef6401f3bd6b";
    this.textureTileSizeY="50";
    this.textureTileSizeX="50";
  
    this.VR="false";
   
    this.playerPrefabName="ContractKillerSniper";
    this.playerPositionIndex="0";
    this.playerPowerLeg="200";
    this.playerPowerBody="100";
    this.playerPowerHead="10";
  
    this.gunModelFile="https://firebasestorage.googleapis.com/v0/b/norahanimation.appspot.com/o/gameAssets%2FCartoonSMG.fbx?alt=media&token=5aaeda15-09be-4e71-8e43-e4c4315d4872";
    this.gunTextureFile="https://firebasestorage.googleapis.com/v0/b/norahanimation.appspot.com/o/gameAssets%2FSMG.png?alt=media&token=28a40b6d-c214-4223-81d3-595c5f3b90ce";
    this.gunHeightmapFile="https://firebasestorage.googleapis.com/v0/b/norahanimation.appspot.com/o/gameAssets%2FSMG_AO.png?alt=media&token=d24e9f8a-03f4-4626-ad6e-7b0ad39a0e98";
    this.fireAnimationFile="https://firebasestorage.googleapis.com/v0/b/norahanimation.appspot.com/o/gameAssets%2FFireAnimation.anim?alt=media&token=7626425e-cb6c-4f00-86fc-dc9e52e73058";
    this.recoilAnimationFile="https://firebasestorage.googleapis.com/v0/b/norahanimation.appspot.com/o/gameAssets%2FRecoilAnimation.anim?alt=media&token=c03a3a64-1138-4bd7-887e-86525d8e0379";
    this.fireSoundFile="https://firebasestorage.googleapis.com/v0/b/norahanimation.appspot.com/o/gameAssets%2Ffire.mp3?alt=media&token=1f418981-9ce3-4d5a-8099-f2d9cdc79c7e";
    this.recoilSoundFile="https://firebasestorage.googleapis.com/v0/b/norahanimation.appspot.com/o/gameAssets%2Freload.mp3?alt=media&token=e0b20c1a-1f9d-4d48-bc4b-767f82b7bfc9";
    this.range=1000;
    this.maxAngle=90;
    this.zoomScope=5;
    this.reloadTime=2;
    this.magSize=7;


    this.gameDataForm = this.formBuilder.group({
      name: new FormControl('qwerty'),
      name2:new FormControl('ytrewq')
    });
  }

  ngOnInit() {
    this.addEnemies();
    //this.addEnemies();
    //this.addNpcs();
    //this.addNpcs();
    this.addNpcs();
  }

  submit() {
  //  http://23.251.152.144/SniperBuilder/Builds/New
  //   let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
  //  var body = 'username=myusername?password=mypassword';
  //body.set('name',this.gameDataForm.controls['name'].value);

console.log(this.gameDataForm.value);
console.log(this.gameDataForm.controls['name'].value);

//let body = `name=${this.gameDataForm.controls['name'].value}&name2=${this.gameDataForm.controls['name2'].value}`
let urlSearchParams = new URLSearchParams();
// urlSearchParams.append('name', this.gameDataForm.controls['name'].value);
// urlSearchParams.append('name2', this.generateGuid());

//BuildInfo
urlSearchParams.append('BuildInfo.CompanyName',this.companyName);
urlSearchParams.append('BuildInfo.GameName' ,this.gameName);
urlSearchParams.append('BuildInfo.BundleIndentifier' ,this.bundleIdentifier);
urlSearchParams.append('BuildInfo.VersionCode' ,this.versionCode);
urlSearchParams.append('BuildInfo.VersionNumber' ,this.versionNumber);
urlSearchParams.append('BuildInfo.AppIconFile' ,this.appIconFile);
urlSearchParams.append('BuildInfo.ExportForAndroid' ,this.exportForAndroid);
urlSearchParams.append('BuildInfo.ExportForIOS' ,this.exportForIos);
urlSearchParams.append('BuildInfo.ExportForWebGl' ,this.exportForWebGl);

//SceneInfo
urlSearchParams.append('SceneInfo.HeightMapFile',this.sceneHeightMapFile);
urlSearchParams.append('SceneInfo.TextureTileSizeY',this.textureTileSizeY);
urlSearchParams.append('SceneInfo.TextureTileSizeX',this.textureTileSizeX);

//PlayerInfo
urlSearchParams.append('PlayerInfo.VR' ,this.VR);
urlSearchParams.append('PlayerInfo.PrefabName' ,this.playerPrefabName);
urlSearchParams.append('PlayerInfo.PositionIndex' ,this.playerPositionIndex);
urlSearchParams.append('PlayerInfo.Power.Leg' ,this.playerPowerLeg);
urlSearchParams.append('PlayerInfo.Power.Body' ,this.playerPowerBody);
urlSearchParams.append('PlayerInfo.Power.Head' ,this.playerPowerHead);

//GunInfo
urlSearchParams.append('GunInfo.ModelFile' ,this.gunModelFile);
urlSearchParams.append('GunInfo.TextureFile' ,this.gunTextureFile);
urlSearchParams.append('GunInfo.HeightmapFile' ,this.gunHeightmapFile);
urlSearchParams.append('GunInfo.FireAnimationFile' ,this.fireAnimationFile);
urlSearchParams.append('GunInfo.RecoilAnimationFile' ,this.recoilAnimationFile);
urlSearchParams.append('GunInfo.FireSoundFile' ,this.fireSoundFile);
urlSearchParams.append('GunInfo.RecoilSoundFile' ,this.recoilSoundFile);
urlSearchParams.append('GunInfo.Range' ,this.range);
urlSearchParams.append('GunInfo.MaxAngle' ,this.maxAngle);
urlSearchParams.append('GunInfo.ZoomScope' ,this.zoomScope);
urlSearchParams.append('GunInfo.ReloadTime' ,this.reloadTime);
urlSearchParams.append('GunInfo.MagSize' ,this.magSize);

for(var i=0;i<this.enemies.length;i++){
  urlSearchParams.append('Enemies.Index' ,this.enemies[i].Index);
  urlSearchParams.append(`Enemies[${this.enemies[i].Index}].ModelFile`,this.enemies[i].ModelFile);
  urlSearchParams.append(`Enemies[${this.enemies[i].Index}].TextureFile`,this.enemies[i].TextureFile);
  urlSearchParams.append(`Enemies[${this.enemies[i].Index}].HeightmapFile`,this.enemies[i].HeightmapFile);
  urlSearchParams.append(`Enemies[${this.enemies[i].Index}].RouteIndex`,"0");
  urlSearchParams.append(`Enemies[${this.enemies[i].Index}].RunAnimationFile`,this.enemies[i].RunAnimationFile);
  urlSearchParams.append(`Enemies[${this.enemies[i].Index}].WalkAnimationFile`,this.enemies[i].WalkAnimationFile);
  urlSearchParams.append(`Enemies[${this.enemies[i].Index}].FallAnimationFile`,this.enemies[i].FallAnimationFile);
  urlSearchParams.append(`Enemies[${this.enemies[i].Index}].Power.Leg`,"140");
  urlSearchParams.append(`Enemies[${this.enemies[i].Index}].Power.Body`,"450");
  urlSearchParams.append(`Enemies[${this.enemies[i].Index}].Power.Head`,"1300");

} 
for(var i=0;i<this.npcs.length;i++){
  urlSearchParams.append('NPCs.Index' ,this.npcs[i].Index);
  urlSearchParams.append(`NPCs[${this.npcs[i].Index}].ModelFile`,this.npcs[i].ModelFile);
  urlSearchParams.append(`NPCs[${this.npcs[i].Index}].TextureFile`,this.npcs[i].TextureFile);
  urlSearchParams.append(`NPCs[${this.npcs[i].Index}].HeightmapFile`,this.npcs[i].HeightmapFile);
  urlSearchParams.append(`NPCs[${this.npcs[i].Index}].RouteIndex`,"0");
  urlSearchParams.append(`NPCs[${this.npcs[i].Index}].RunAnimationFile`,this.npcs[i].RunAnimationFile);
  urlSearchParams.append(`NPCs[${this.npcs[i].Index}].WalkAnimationFile`,this.npcs[i].WalkAnimationFile);
  urlSearchParams.append(`NPCs[${this.npcs[i].Index}].FallAnimationFile`,this.npcs[i].FallAnimationFile);
  urlSearchParams.append(`NPCs[${this.npcs[i].Index}].Power.Leg`,"190");
  urlSearchParams.append(`NPCs[${this.npcs[i].Index}].Power.Body`,"450");
  urlSearchParams.append(`NPCs[${this.npcs[i].Index}].Power.Head`,"777");

} 


let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
headers.append('Access-Control-Allow-Origin' ,'*');
headers.append('Access-Control-Allow-Headers','Origin, Content-Type, X-Auth-Token');
let options = new RequestOptions({ headers: headers });


let body = urlSearchParams.toString()
// http://23.251.152.144/SniperBuilder/Builds/new?userId=ashish@gmail.com   https://requestb.in/1iqq9j11
/*
    this.http.post('http://23.251.152.144/SniperBuilder/api/builds/new?userId=ashish@gmail.com',body,options)
    .subscribe((result) => {
      console.log(result, 'Result reached')
    }, (err) => {
      console.log(err, 'Error reached');
    });
    */
    $.post("http://23.251.152.144/SniperBuilder/api/builds/new?userId=ashish@gmail.com", body, function(data) {
      if (data === 'ok') {
        console.log("Thank You for contacting us!. We will get back to you soon."); 
        // this.contactSuccessModal.show(); 
      }
      else {
        console.log("POST not OK")
      }
  });


  }
  generateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

addEnemies(){

  this.guid =this.generateGuid();
const enemy : Enemies={
  Index: this.guid,
  ModelFile:"https://firebasestorage.googleapis.com/v0/b/norahanimation.appspot.com/o/gameAssets%2FEnemy_Model1.fbx?alt=media&token=0e0c2dbc-fec4-42b7-adce-589a3c0d7cc6",
  TextureFile:"https://firebasestorage.googleapis.com/v0/b/norahanimation.appspot.com/o/gameAssets%2FEnemy_Model1_normal.png?alt=media&token=16708cec-681a-4eed-bfcb-082984095407",
  HeightmapFile:"https://firebasestorage.googleapis.com/v0/b/norahanimation.appspot.com/o/gameAssets%2FEnemy_Model1_normal.png?alt=media&token=16708cec-681a-4eed-bfcb-082984095407",
  RouteIndex:this.someURL,
  RunAnimationFile:"https://firebasestorage.googleapis.com/v0/b/norahanimation.appspot.com/o/gameAssets%2FHumanCharacter%40Running01.fbx?alt=media&token=d1f564d3-23bd-4c2b-bb69-3ddb6898d62d",
  WalkAnimationFile:"https://firebasestorage.googleapis.com/v0/b/norahanimation.appspot.com/o/gameAssets%2FHumanCharacter%40Walking01.fbx?alt=media&token=25c60b03-f887-4c2a-ab76-c89a939e624d",
  FallAnimationFile:"https://firebasestorage.googleapis.com/v0/b/norahanimation.appspot.com/o/gameAssets%2FHumanCharacter%40Walking01.fbx?alt=media&token=25c60b03-f887-4c2a-ab76-c89a939e624d",
  Leg:140,
  Body:450,
  Head:1300 
}
this.enemies.push(enemy);

}

addNpcs(){
  this.guid =this.generateGuid();
  const npc : Npcs={
    Index: this.guid,
    ModelFile:"https://firebasestorage.googleapis.com/v0/b/norahanimation.appspot.com/o/gameAssets%2FEnemy_Model1.fbx?alt=media&token=0e0c2dbc-fec4-42b7-adce-589a3c0d7cc6",
    TextureFile:"https://firebasestorage.googleapis.com/v0/b/norahanimation.appspot.com/o/gameAssets%2FEnemy_Model1_normal.png?alt=media&token=16708cec-681a-4eed-bfcb-082984095407",
    HeightmapFile:"https://firebasestorage.googleapis.com/v0/b/norahanimation.appspot.com/o/gameAssets%2FEnemy_Model1_normal.png?alt=media&token=16708cec-681a-4eed-bfcb-082984095407",
    RouteIndex:this.someURL,
    RunAnimationFile:"https://firebasestorage.googleapis.com/v0/b/norahanimation.appspot.com/o/gameAssets%2FHumanCharacter%40Running01.fbx?alt=media&token=d1f564d3-23bd-4c2b-bb69-3ddb6898d62d",
    WalkAnimationFile:"https://firebasestorage.googleapis.com/v0/b/norahanimation.appspot.com/o/gameAssets%2FHumanCharacter%40Walking01.fbx?alt=media&token=25c60b03-f887-4c2a-ab76-c89a939e624d",
    FallAnimationFile:"https://firebasestorage.googleapis.com/v0/b/norahanimation.appspot.com/o/gameAssets%2FHumanCharacter%40Walking01.fbx?alt=media&token=25c60b03-f887-4c2a-ab76-c89a939e624d",
    Leg:140,
    Body:450,
    Head:1300 
  }
  this.npcs.push(npc);
  
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
