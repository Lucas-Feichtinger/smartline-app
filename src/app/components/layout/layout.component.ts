import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { FooterComponent } from '../footer/footer.component'
import { NavbarComponent } from '../navbar/navbar.component'
@Component({
   standalone: true,
   imports: [
      CommonModule,
      RouterModule,
      //Directives
      FooterComponent,
      NavbarComponent,
   ],
   selector: 'app-layout',
   templateUrl: './layout.component.html',
   styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {}
