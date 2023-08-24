import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
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
  searchText: any;
  bienImmo : any

  constructor(
    private Dataservice: DataService,
    private router: Router,
    private serviceBienImmo: BienimmoService,
    private serviceCommodite: CommoditeService,
  ) {
    this.gridBlog = this.Dataservice.gridBlog;
    this.categories = this.Dataservice.categoriesList;
    (this.categoriesDataSource = new MatTableDataSource(this.categories));
  }
  searchCategory(value: any): void {
    const filterValue = value;
    this.categoriesDataSource.filter = filterValue.trim().toLowerCase();
    this.categories = this.categoriesDataSource.filteredData;
  }

  ngOnInit(): void {
    //AFFICHER LA LISTE DES COMMODITES
    this.serviceCommodite.AfficherLaListeCommodite().subscribe(data => {
      this.typebien = data.type;
      console.log(this.typebien);
    });

    //AFFICHER LA LISTE DES BIENS IMMO
    this.serviceBienImmo.AfficherLaListeBienImmo().subscribe(data => {
      this.bienImmo = [data.biens.reverse()[0], data.biens.reverse()[1],data.biens.reverse()[2]];
     console.log(this.bienImmo);
     console.log(data);
     console.log(data.biens.length);
   });
  }
  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS D'UN BLOG
  goToDettailBlog(id: number) {
    console.log(id);
    return this.router.navigate(['blog-details', id])
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN
  goToDettailBien(id: number) {
    console.log(id);
    return this.router.navigate(['pages/service-details', id])
  }

     //IMAGE
     generateImageUrl(photoFileName: string): string {
      const baseUrl = URL_PHOTO + '/uploads/images/';
      return baseUrl + photoFileName;
    }

}
