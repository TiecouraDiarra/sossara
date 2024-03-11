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
  constructor(private http: HttpClient, private storageService: StorageService) { }
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
      URL_BASE + '/auth/signin',
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
    nomDoc: string,
    numDoc: string,
    role: string,
    nomPhoto: any
  ): Observable<any> {
    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('telephone', telephone);
    formData.append('dateNaissance', dateNaissance);
    formData.append('nomDoc', nomDoc);
    formData.append('numDoc', numDoc);
    const roles = [role, 'userRole'];
    formData.append('role[]', roles[0]);
    formData.append('role[]', roles[1]);
    // Suppose que role est un tableau
    // const roles = ['userRole'];

    // roles.forEach(role => {
    //   formData.append('role', role);
    // });
    formData.append('nomPhoto', nomPhoto as Blob);
    // Définition du header Content-Type
    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data'
    });

    // Utilisation des options pour ajouter les headers
    const options = { headers: headers };

    return this.http.post(
      this.URL_BASE + '/auth/signup',
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
    const req = new HttpRequest('POST', URL_BASE + '/logout', {}, httpOptions);
    localStorage.removeItem('token'); // Supprime le token JWT du stockage local
    return this.http.request(req);
}


  reloadPage(): void {
    window.location.reload();
  }

}
