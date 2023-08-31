import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLinkActive, RouterLink } from '@angular/router'
import { UserService } from 'src/app/services'
import { of, switchMap } from 'rxjs'
import { FormsModule } from '@angular/forms'
import { UserRightsEnum } from './enums/switch-direction.enum'

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

   public UserRight = UserRightsEnum

   public Allowance$ = this.userSer.User$.pipe(
      switchMap((user) => {
         const role = user?.Role ?? ''
         if (role === 'admin') {
            return of(this.UserRight.Admin)
         } else if (role === 'user') {
            return of(this.UserRight.User)
         } else {
            return of(this.UserRight.None)
         }
      })
   )
}
