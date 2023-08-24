import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLinkWithHref, RouterOutlet } from '@angular/router'

@Component({
   standalone: true,
   imports: [CommonModule, RouterOutlet, RouterLinkWithHref],
   selector: 'app-production-management',
   templateUrl: './production-management.component.html',
   styleUrls: ['./production-management.component.scss'],
})
export class ProductionManagementComponent {}
