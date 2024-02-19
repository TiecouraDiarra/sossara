import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../auth/storage.service';
import { environment } from 'src/app/environments/environment';
import { Observable } from 'rxjs';

const URL_BASE: string = environment.Url_BASE


@Injectable({
  providedIn: 'root'
})
export class BlogService {


  private accessToken!: string; // Ajoutez cette ligne


  setAccessToken(token: string) {
    this.accessToken = token;
  }
  // Méthode pour ajouter le token JWT aux en-têtes
  getHeaders(): HttpHeaders {
    const token = this.storageService.getUser().token;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  // URL_BASE: string = environment.Url_BASE
  constructor(
    private storageService: StorageService,
    private http: HttpClient) { }

  //AFFICHER  UN BLOG EN FONCTION DE L'ID
  AfficherBlogParId(id: number): Observable<any> {
    return this.http.get(`${URL_BASE}/blog/${id}`);
  }


  //AFFICHER LA LISTE DES BLOGS
  AfficherLaListeBlog(): Observable<any> {
    return this.http.get(`${URL_BASE}/blog/afficher`);
  }
}
