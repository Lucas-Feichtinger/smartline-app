import { Directive, TemplateRef } from '@angular/core'

let ItemCounter = 0

@Directive({
   selector: 'combobox-item,[combobox-item]',
   standalone: true,
})
export class ComboboxItemDirective {
   public readonly ID: string

   constructor(public template: TemplateRef<any>) {
      ItemCounter++
      this.ID = 'combobox-item-' + ItemCounter
   }
}
