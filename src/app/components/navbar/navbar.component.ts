import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLinkActive, RouterLink } from '@angular/router'

@Component({
   selector: 'app-navbar',
   standalone: true,
   imports: [CommonModule, RouterLinkActive, RouterLink],
   templateUrl: './navbar.component.html',
   styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {}
