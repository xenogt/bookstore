import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  user: User = new User();
  faUser = faUserCircle;
  errorMessage: string = "";

  constructor(
    private authSvc: AuthenticationService, 
    private router: Router) { }

  ngOnInit(): void {
    if(this.authSvc.currentUserValue?.id) {
      this.router.navigate(['/profile']);
      return;
    }
  }

  public register() {
    this.authSvc.register(this.user).subscribe(
      data => {
        this.router.navigate(['/login']);
      }, 
      err => {
        if(err?.status == 409) {
          this.errorMessage = 'Username already exist.';
        } else {
          this.errorMessage = 'unexpected error occurred, the Erro is: '+ err?.errorMessage;
          console.log(err);
        }
      }
    );
  }

}
