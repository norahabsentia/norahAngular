import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Animation } from './repository.component';
import * as firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
@Injectable()
export class RepositoryService {

  private page: BehaviorSubject<number> = new BehaviorSubject(1);
  public page$: Observable<number> = this.page.asObservable();
  private firebaseApp;
  private selectedTags = new Subject<string>();
  private unselectedTags = new Subject<string>();
  selectedTags$ = this.selectedTags.asObservable();
  unselectedTags$ = this.unselectedTags.asObservable();
  private tagStore: string[] = [];

  constructor(
    private db: AngularFireDatabase
  ) {
  }
  get animations(): Observable<Animation[]> {
    firebase.database().ref('/tags')
      .once('value', (data) => {
      console.log(data.val());
    });
    firebase.database().ref('/animations').orderByChild('name')
      .once('value', (data) => {
      console.log(data.val());
    });
    return this.db.list('/animations', {
      query: {
        orderByChild: 'name'
      }
    });
  }
  nextPage(page: number) {
    this.page.next(page);
  }
  get tags() {
    return this.db.list('/tags');
  }

  addTag(tag: string) {
    if (!this.tagStore.includes(tag)) {
      this.tagStore.push(tag);
    }
    console.log('tag', tag);
    this.selectedTags.next(tag);
  }
  removeTagFromPanel(tag) {
    this.tagStore.splice(this.tagStore.indexOf(tag), 1);
    this.unselectedTags.next(tag);
  }

  getRepoRating(image){
    var name = image.split(".",1);
    return firebase.database()
              .ref('ratings')
              .child('repoGen')
              .child(`${name}`)
              .once('value')
  }

  calculateRating(snapshot){
    var rating = 5;
    if(snapshot.val()){
      var stars = 0;
      var users = 0;
      snapshot.forEach(function(messageSnapshot) {
        if(["1","2","3","4","5"].includes(messageSnapshot.key)){
          stars = stars + (messageSnapshot.key * messageSnapshot.val());
          users = users + messageSnapshot.val();
        }
      });
      console.log("starts"+stars);
      console.log("users"+users);
      if( users != 0){
          rating = stars/users;
      }
      if(rating == 0)
        rating = 5;
    }
    return rating;
  }

  addRating(image, rating) {
    var name = image.split(".",1);
    firebase.database()
              .ref('ratings')
              .child('repoGen')
              .child(`${name}`)
              .once('value')
              .then(function (snapshot) {
                var users = 0;
                if(snapshot.val()){
                  snapshot.forEach(function(messageSnapshot) {
                    //stars = stars + (messageSnapshot.key * messageSnapshot.val());
                    //users = users + messageSnapshot.val();
                    console.log(messageSnapshot.val());
                    if(messageSnapshot.key == rating){
                      users = messageSnapshot.val();
                    }
                  });
                }
                users = users + 1;
                const dummyObj = {[rating]:users};
                firebase.database()
                 .ref('ratings')
                 .child('repoGen')
                 .child(`${name}`)
                 .update({[rating]:users}).then((item) => { console.log("UPDATED"); });
                 /*});*/


     });

     /* const dummyObj = {
      1: "1",
      2: "2",
      3: "3",
      4: "4",
      5: "5"
    };
 firebase.database()
        .ref('ratings')
        .child('gunGen')
        .child(category)
        .child(name.split(".",1))
        .push(dummyObj).then((item) => { console.log(item.key); });
});*/

  }

}
