import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
   selector: 'app-loading-circle',
   templateUrl: './loading-circle.component.html',
   styleUrls: ['./loading-circle.component.scss'],
   standalone: true,
   imports: [CommonModule],
})
export class LoadingCircleComponent {
   @Input() size = '70'
   @Input() strokeWidth = '2'
}
