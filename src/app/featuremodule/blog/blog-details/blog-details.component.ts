import { Component, Inject, LOCALE_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes'
import { environment } from 'src/app/environments/environment';
import { BlogService } from 'src/app/service/blog/blog.service';
import { CommoditeService } from 'src/app/service/commodite/commodite.service';
import { DataService } from 'src/app/service/data.service';

const URL_PHOTO: string = environment.Url_PHOTO;



@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent {
  public routes = routes;
  typebien: any
  blog: any
  id: any
  locale!: string;
  public gridBlog: any = [];

  constructor(
    private serviceCommodite: CommoditeService,
    private serviceBlog: BlogService,
    @Inject(LOCALE_ID) private localeId: string,
    private route: ActivatedRoute,
    private Dataservice: DataService,

  ) {
    this.locale = localeId;
    this.gridBlog = this.Dataservice.gridBlog
  }

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'assets/img/gallery/gallery1/gallery-1.jpg';
  }
  handleAuthorImageError1(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }
  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }
  ngOnInit(): void {
    //RECUPERER L'UUID D'UN BLOG 
    this.id = this.route.snapshot.params["id"]
    this.serviceBlog.AfficherBlogParUuId(this.id).subscribe(data => {
      this.blog = data;
      console.log(this.blog);
    })
    //AFFICHER LA LISTE DES COMMODITES
    this.serviceCommodite.AfficherLaListeCommodite().subscribe(data => {
      this.typebien = data.type;
      console.log(this.typebien);
    });
  }
}
