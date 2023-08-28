import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
   standalone: true,
   imports: [CommonModule],
   selector: 'app-footer',
   templateUrl: './footer.component.html',
   styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
   public CurrentYear = new Date().getFullYear()
}
