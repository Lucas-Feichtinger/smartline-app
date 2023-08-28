import { Component, OnInit, inject } from '@angular/core'
import { UserService } from './services'

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
   public userSer = inject(UserService)

   async ngOnInit() {
      await this.userSer.getUser()
   }
}
