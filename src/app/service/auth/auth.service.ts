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
    telephone: string,
    dateNaissance: string,
    nom_doc: string,
    num_doc: string,
    roles: string,
    photo: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('telephone', telephone);
    formData.append('dateNaissance', dateNaissance);
    formData.append('nom_doc', nom_doc);
    formData.append('num_doc', num_doc);
    formData.append('roles', roles);
    formData.append('photo', photo);

    return this.http.post(
      this.URL_BASE + '/register',
        formData,
      httpOptions
    );
  }

  logout(): Observable<any> {
    //return this.http.post(AUTH_API + 'signout', {}, httpOptions);
    const req = new HttpRequest('POST', URL_BASE + '/logout', {}, httpOptions);
    return this.http.request(req);
  }

  
}
