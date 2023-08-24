import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes'
import { CommoditeService } from 'src/app/service/commodite/commodite.service';
import { DataService } from 'src/app/service/data.service';
@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent {
  public routes = routes;
  typebien: any
  id: any
  public gridBlog: any = [];

  constructor(
    private serviceCommodite: CommoditeService,
    private route: ActivatedRoute,
    private Dataservice: DataService,

  ) {
    this.gridBlog = this.Dataservice.gridBlog
  }

  ngOnInit(): void {
    //RECUPERER L'ID D'UN BLOG 
    this.id = this.route.snapshot.params["id"]

    // Assurez-vous que l'ID est un nombre valide (parse si nécessaire)
    const blogId = parseInt(this.id);
    // Vérifiez si l'ID est valide et dans la plage de l'array gridBlog
    if (!isNaN(blogId) && blogId >= 0 && blogId < this.Dataservice.gridBlog.length) {
      // Attribuez le blog correspondant à gridBlog[id]
      this.gridBlog = this.Dataservice.gridBlog[blogId];
      console.log(this.gridBlog);
    } else {
      // Gérez le cas où l'ID n'est pas valide ou n'existe pas dans gridBlog
      console.log("ID de blog invalide ou introuvable.");
    }

    // this.gridBlog=this.Dataservice.gridBlog[0]
    // console.log(this.gridBlog);

    //AFFICHER LA LISTE DES COMMODITES
    this.serviceCommodite.AfficherLaListeCommodite().subscribe(data => {
      this.typebien = data.type;
      console.log(this.typebien);
    });
  }
}
