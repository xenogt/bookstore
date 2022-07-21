import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  API_URL: string = `${environment.BASE_URL}/api/authentication/`;
  public currentUser: Observable<User> | undefined;
  private currentUserSubject: BehaviorSubject<User> | undefined;
  
  constructor(private http: HttpClient) { 
    let storageUser;
    const storageUserAsStr = localStorage.getItem('currentUser');
    if(storageUserAsStr) {
      storageUser = JSON.parse(storageUserAsStr);
    }

    this.currentUserSubject = new BehaviorSubject<User>(storageUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | undefined{
    return this.currentUserSubject?.value;
  }

  login(user: User): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/sign-in`, user).pipe(
      map(response => {
        if(response) {
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.currentUserSubject?.next(response);
        }
        return response;
      })
    );
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.API_URL}/sign-up`, user);
  }

  logOut() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject?.next(new User);
  }
}

