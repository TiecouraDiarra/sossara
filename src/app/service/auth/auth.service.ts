import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const AUTH_API: String = 'http://192.168.1.4:8000/api/';

const httpOptions: any = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'login',
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
      AUTH_API + 'register',
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
    const req = new HttpRequest('POST', AUTH_API + 'logout', {}, httpOptions);
    return this.http.request(req);
  }
}
