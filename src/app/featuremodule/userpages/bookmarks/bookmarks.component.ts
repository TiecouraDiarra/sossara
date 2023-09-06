import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { routes } from 'src/app/core/helpers/routes/routes';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css']
})
export class BookmarksComponent implements OnInit{
  public routes=routes;
  locale!: string;
  isLocataire = false;
  isAgence = false;
  roles: string[] = [];
  public commune = [
    "Commune",
    'Commune 1',
    'Commune 2',
    'Commune 3',
    'Commune 4',
    'Commune 5',
    'Commune 6',
  ];

  public Bookmarksdata:any=[]
  public electronics: any = []

  
  constructor(
    private dataservice:DataService,
    @Inject(LOCALE_ID) private localeId: string,
    private serviceUser: UserService,
    private storageService: StorageService,
    ){
    this.locale = localeId;
   this.Bookmarksdata=this.dataservice.Bookmarksdata
  }
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      // this.isLoggedIn = true;
      this.roles = this.storageService.getUser().user.role;
      console.log(this.roles);
      if (this.roles[0] == "ROLE_LOCATAIRE") {
        this.isLocataire = true
      }else if(this.roles[0] == "ROLE_AGENCE") {
        this.isAgence = true
      }
    }
  }
  sortData(sort: Sort) {
    const data = this.electronics.slice();

    if (!sort.active || sort.direction === '') {
      this.electronics = data;
    } else {
      this.electronics = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }
}
