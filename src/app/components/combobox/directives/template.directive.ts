import { Directive, Input, TemplateRef } from '@angular/core'

@Directive({
   selector: '[template]',
})
export class TemplateDirective {
   @Input('template')
   public ID = ''

   constructor(public template: TemplateRef<any>) {}
}
