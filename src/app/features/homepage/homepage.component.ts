import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLinkWithHref, RouterOutlet } from '@angular/router'

@Component({
   standalone: true,
   imports: [CommonModule, RouterOutlet, RouterLinkWithHref],
   selector: 'app-homepage',
   templateUrl: './homepage.component.html',
   styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent {}
