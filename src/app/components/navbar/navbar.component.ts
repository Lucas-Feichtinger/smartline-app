import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLinkActive, RouterLink } from '@angular/router'
import { UserService } from 'src/app/services'
import { of, switchMap } from 'rxjs'
import { FormsModule } from '@angular/forms'
import { UserRights } from './enums/switch-direction.enum'

@Component({
   standalone: true,
   imports: [CommonModule, FormsModule, RouterLinkActive, RouterLink],
   selector: 'app-navbar',
   templateUrl: './navbar.component.html',
   styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
   // Services
   public userSer = inject(UserService)

   public UserRight = UserRights

   public Allowance$ = this.userSer.User$.pipe(
      switchMap((user) => {
         const role = user?.Role ?? ''
         if (role === 'admin') {
            return of(UserRights.Admin)
         } else if (role === 'user') {
            return of(UserRights.User)
         } else {
            return of(UserRights.None)
         }
      })
   )
}
