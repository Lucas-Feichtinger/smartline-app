import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
   selector: 'loading-circle',
   templateUrl: './loading-circle.component.html',
   styleUrls: ['./loading-circle.component.scss'],
   standalone: true,
   imports: [CommonModule],
})
export class LoadingCircleComponent {
   @Input('size') Size: string = '70'
   @Input('strokeWidth') StrokeWidth: string = '2'
}
