import { Directive, Input, ElementRef } from '@angular/core'

@Directive({
   selector: 'li[id]',
   standalone: true,
})
export class ComboboxIdDirective {
   @Input('id') Id = 0
   El: HTMLElement

   constructor(ref: ElementRef<HTMLElement>) {
      this.El = ref.nativeElement
   }
}
