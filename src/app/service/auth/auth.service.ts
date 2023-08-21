import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { StorageService } from './storage.service';
// import { JwtHelperService } from '@auth0/angular-jwt';


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
  constructor(private http: HttpClient, private storageService: StorageService) {}
  // private jwtHelper: JwtHelperService = new JwtHelperService();
  // private token!: string;

   // Méthode pour ajouter le token JWT aux en-têtes
   getHeaders(): HttpHeaders {
    const token = this.storageService.getUser().token;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

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
    photos: File[]
  ): Observable<any> {
    const formData = new FormData();
    console.log('nom: ', nom);
      console.log('email: ', email);
      console.log('password: ', password);
      console.log('telephone: ', telephone);
      console.log('dateNaissance: ', dateNaissance);
      console.log('nom_doc: ', nom_doc);
      console.log('num_doc: ', num_doc);
      console.log('roles: ', roles);
    formData.append('nom', nom);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('telephone', telephone);
    formData.append('dateNaissance', dateNaissance);
    formData.append('nom_doc', nom_doc);
    formData.append('num_doc', num_doc);
    formData.append('roles', roles);
    photos.forEach(p=>{formData.append('photo[]', p)});

     // Définition du header Content-Type
     const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data'
  });

  // Utilisation des options pour ajouter les headers
  const options = { headers: headers };

    return this.http.post(
      this.URL_BASE + '/register',
        formData,
        // options
    );
  }

  // isTokenExpired(): boolean {
  //   // Vérifiez si le token est défini
  //   if (!this.token) {
  //     return true;
  //   }

  //   // Utilisez le JwtHelperService pour vérifier si le token est expiré
  //   return this.jwtHelper.isTokenExpired(this.token);
  // }

  logout(): Observable<any> {
    //return this.http.post(AUTH_API + 'signout', {}, httpOptions);
    const req = new HttpRequest('POST', URL_BASE + '/logout', {}, httpOptions);
    return this.http.request(req);
  }

  
}
