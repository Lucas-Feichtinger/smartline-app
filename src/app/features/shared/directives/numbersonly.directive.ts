import { Directive, ElementRef, HostListener, Input } from '@angular/core'

@Directive({
   standalone: true,
   selector: 'input[numbersOnly]',
})
export class NumberDirective {
   constructor(private elem: ElementRef) {}

   @Input('numbersOnly')
   public length = 0

   // Restrict all input but numbers
   @HostListener('input', ['$event.target.value']) onInputChange(
      value: string
   ) {
      console.log('value', value)
      // RegEx proves if a number is input else input is ''
      const strippedValue = value
         .replace(/[^0-9|\\.|-]*/g, '')
         .slice(0, this.length)
      this.elem.nativeElement.value = strippedValue
   }
}
