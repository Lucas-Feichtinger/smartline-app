import { Directive, ElementRef, HostListener, Input } from '@angular/core'

@Directive({
   standalone: true,
   selector: 'input[numbersOnly]',
})
export class NumberDirective {
   constructor(private elem: ElementRef) {}

   @Input('numbers-only')
   public length: number = 0

   // Restrict all input but numbers
   @HostListener('input', ['$event.target.value']) onInputChange(
      value: string
   ) {
      // RegEx proves if a number is input else input is ''
      const strippedValue = value
         .replace(/[^0-9|\\.|-]*/g, '')
         .slice(0, this.length)
      this.elem.nativeElement.value = strippedValue
   }
}
