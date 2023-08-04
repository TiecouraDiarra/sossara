import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/auth/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit{
  public routes = routes;
  public Toggledata = true;
  type = true;

  User : any;

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  form: any = {
    email: null,
    password: null,
  };

  constructor(
    public router: Router, 
    private authService: AuthService,
    private storageService: StorageService
    ) {}


    ngOnInit(): void {
      // if (this.storageService.isLoggedIn()) {
      //   this.isLoggedIn = true;
      //   this.roles = this.storageService.getUser().roles;
      // }
      console.log(this.storageService.getUser());
    }
  path() {
    this.router.navigate([routes.dashboard]);
  }

  iconLogle() {
    this.Toggledata = !this.Toggledata;
  }

  onSubmit(form: NgForm): void {
    const { email, password } = this.form;
    this.authService.login(email, password).subscribe({
      next: (data) => {
         this.storageService.saveUser(data);
        //this.User = data;
        // this.isLoginFailed = true;
        // this.User = this.storageService.getUser();
        //console.log(data);
        // console.log(this.User);
      },
      error: (err) => {
        console.log(err);
      },
    });
    console.log(this.storageService.getUser());
    console.log('email: ', email);
    console.log('password: ', password);
  }
}
