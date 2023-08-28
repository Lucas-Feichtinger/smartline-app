import { Component, computed, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLinkActive, RouterLink } from '@angular/router'
import { UserService } from 'src/app/services'
import { firstValueFrom, map, of } from 'rxjs'
import { FormsModule } from '@angular/forms'

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

   public Allowance$ = computed(() => {
      return this.userSer.User$.pipe(
         map((user) => {
            const role = user?.Role ?? ''
            if (role === 'admin') {
               return 2
            } else if (role === 'user') {
               return 1
            }
            return 0
         })
      )
   })
}
