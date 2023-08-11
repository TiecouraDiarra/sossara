import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';


// const AUTH_API: String = 'http://192.168.1.6:8000/api/';
const URL_BASE: string = environment.Url_BASE

const httpOptions: any = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  URL_BASE: string = environment.Url_BASE
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      URL_BASE + '/login',
      {
        email,
        password,
      },
      httpOptions
    );
  }

  register(
    nom: string,
    email: string,
    password: string,
    telephone: string
  ): Observable<any> {
    return this.http.post(
      this.URL_BASE + '/register',
      {
        nom,
        email,
        password,
        telephone,
      },
      httpOptions
    );
  }

  logout(): Observable<any> {
    //return this.http.post(AUTH_API + 'signout', {}, httpOptions);
    const req = new HttpRequest('POST', URL_BASE + '/logout', {}, httpOptions);
    return this.http.request(req);
  }

  
}
