import { Component, Inject, LOCALE_ID } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { BlogService } from 'src/app/service/blog/blog.service';
import { CommoditeService } from 'src/app/service/commodite/commodite.service';
import { DataService } from 'src/app/service/data.service';

const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-blog-grid-sidebar',
  templateUrl: './blog-grid-sidebar.component.html',
  styleUrls: ['./blog-grid-sidebar.component.css']
})
export class BlogGridSidebarComponent {
  public routes = routes;
  public gridBlog: any = [];
  categoriesDataSource = new MatTableDataSource();
  searchInputCategory: any;
  public categories: any = [];
  selectedCategory: any = '';
  typebien: any;
  blog: any;
  searchText: any;
  locale!: string;
  bienImmo: any

  constructor(
    private Dataservice: DataService,
    private router: Router,
    private serviceBienImmo: BienimmoService,
    private serviceBlog: BlogService,
    @Inject(LOCALE_ID) private localeId: string,
    private serviceCommodite: CommoditeService,
  ) {
    this.locale = localeId;
    this.gridBlog = this.Dataservice.gridBlog;
    this.categories = this.Dataservice.categoriesList;
    (this.categoriesDataSource = new MatTableDataSource(this.categories));
  }
  searchCategory(value: any): void {
    const filterValue = value;
    this.categoriesDataSource.filter = filterValue.trim().toLowerCase();
    this.categories = this.categoriesDataSource.filteredData;
  }
  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'https://img.freepik.com/vecteurs-libre/bloguer-amusant-creation-contenu-streaming-ligne-blog-video-jeune-fille-faisant-selfie-pour-reseau-social-partage-commentaires-strategie-auto-promotion-illustration-metaphore-concept-isole-vecteur_335657-855.jpg';
  }
  handleAuthorImageError1(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }
  ngOnInit(): void {
    //AFFICHER LA LISTE DES COMMODITES
    // this.serviceCommodite.AfficherLaListeCommodite().subscribe(data => {
    //   this.typebien = data.type;
    // });

    //AFFICHER LA LISTE DES BLOGS
    this.serviceBlog.AfficherLaListeBlog().subscribe(data => {
      this.blog = data;
    });

    //AFFICHER LA LISTE DES BIENS IMMO
    // this.serviceBienImmo.AfficherLaListeBienImmo().subscribe(data => {
    //   // Tri des biens immobiliers par ordre décroissant de la date de création
    //   data.sort((a: { createdAt: string | number | Date; }, b: { createdAt:string | number | Date; }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    //   // Extraction des trois biens immobiliers les plus récents
    //   this.bienImmo = data.slice(0, 3);
    
    
    // });

    this.serviceBienImmo.trouverTop6BiensRecemmentAjoutes().subscribe((data) => {
      this.bienImmo = data.slice(0, 3);
    });
    
  }
  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS D'UN BLOG
  goToDettailBlog(id: number) {
    return this.router.navigate(['blog-details', id])
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN
  goToDettailBien(id: number) {

    return this.router.navigate(['details-bien', id])
  }

  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }

}
