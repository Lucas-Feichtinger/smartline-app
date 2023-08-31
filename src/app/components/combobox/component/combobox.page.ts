import {
   AfterContentInit,
   AfterViewInit,
   Component,
   ContentChild,
   ContentChildren,
   ElementRef,
   EventEmitter,
   HostListener,
   Input,
   OnInit,
   Output,
   QueryList,
   TemplateRef,
   ViewChild,
   ViewChildren,
   signal,
} from '@angular/core'
import { Subscription } from 'rxjs'
import { TemplateDirective } from '../directives/template.directive'
import { ComboboxIdDirective } from '../directives/combobox-id.directive'
import { ComboboxItemDirective } from '../directives/combobox-item.directive'
import {
   ComboboxContext,
   ComboboxDataRequestIFace,
   ComboboxItemIFace,
   ComboboxSetDataArgs,
   ComboboxSetDataArgsI,
} from '../model'
import { NgTemplateOutlet, CommonModule } from '@angular/common'
import { uf_searchObject } from 'src/app/util-functions/search-object/search-object.uf'

@Component({
   selector: 'app-combobox',
   templateUrl: './combobox.page.html',
   styleUrls: ['./combobox.page.scss'],
   standalone: true,
   imports: [ComboboxIdDirective, NgTemplateOutlet, CommonModule],
})
export class ComboboxComponent<T>
   implements OnInit, AfterContentInit, AfterViewInit
{
   public IsMenuInteracting = false
   // Provides limitation for certain functions only for the current Comboboxes menu
   // if multiple Comboboxes are on one site
   public DropdownMenuActive = false
   // Direction the dropdown menu displays
   public DropdownDirection: 'up' | 'down' = 'down'
   // Return orientation to the previous value if nothing was selected
   public PreviousValue = ''
   // Important for stateless searching
   public DisplayableDataset: ComboboxItemIFace<T>[] = []
   // Highlights the selected item Via
   public HoveredItem: ComboboxItemIFace<T> | null = null
   // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
   public PlaceholderTemplate!: TemplateRef<any>
   // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
   public Context = new ComboboxContext<T>()
   private ContextSubscription: Subscription = new Subscription()
   private ContextCommandSubscription: Subscription = new Subscription()
   // Bindings
   @Input() set context(context: ComboboxContext<T>) {
      this.ContextSubscription.unsubscribe()
      this.ContextCommandSubscription.unsubscribe()
      this.Context = context

      this.ContextCommandSubscription = this.Context.$Command.subscribe(
         (cmd) => {
            switch (cmd.command) {
               case 'request-data':
                  this.requestComboboxData()
                  break
            }
         }
      )

      setTimeout(() => {
         this.Context.execCommandStack()
      }, 0)
   }
   // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
   public Label = ''
   @Input() set label(label: string) {
      this.Label = label
   }
   // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
   public ClearSelection = true
   @Input() set clearSelection(clearSelection: boolean) {
      this.ClearSelection = clearSelection
   }
   // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
   public Placeholder = ''
   @Input() set placeholder(placeholder: string) {
      this.Placeholder = placeholder
   }
   // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
   public Value = signal('')
   @Input() set value(value: string) {
      this.Value.set(value)
   }

   public Disabled = false
   @Input() set disabled(disabled: boolean) {
      this.Disabled = disabled
      if (disabled) {
         this.ClearSelection = false
      }
   }
   // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
   @Input() set dataset(data: ComboboxItemIFace<T>[]) {
      this.Context.Dataset = data
   }
   // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
   public SelectedItem: ComboboxItemIFace<T> | null = null
   @Input() set setItem(selectedItem: T) {
      // Timeout to finish loading DisplayableDataset so the Selected item can be found
      setTimeout(() => {
         this.DisplayableDataset.find((item) => {
            if (item.ItemData === selectedItem) {
               this.SelectedItem = item
            }
         })
      }, 0)
   }
   // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
   @Output() dataRequestEvent = new EventEmitter<ComboboxDataRequestIFace<T>>()
   // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
   @Output() itemSelectEvent = new EventEmitter<T>()
   // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
   @Output() clearValueEvent = new EventEmitter<void>()
   // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
   @ContentChild(ComboboxItemDirective) ComboboxItem!: ComboboxItemDirective
   // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
   @ContentChildren(TemplateDirective) TemplateList =
      new QueryList<TemplateDirective>()
   // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
   @ViewChild('input') Input!: ElementRef
   @ViewChildren(ComboboxIdDirective) els!: QueryList<ComboboxIdDirective>

   // Open Combobox field after tabbing -> no more (click) event needed in HTML
   onFocus() {
      if (!this.Disabled) {
         setTimeout(() => {
            this.openDropdownMenu()
            this.PreviousValue = this.Value()
            this.Value.set('')
         }, 0)
      }
   }

   onFocusout() {
      if (!this.Disabled) {
         // only close when the user is don interacting
         if (!this.IsMenuInteracting) {
            this.closeDropdownMenu(this.PreviousValue)
         }

         this.IsMenuInteracting = false
      }
   }

   public CurrentListItem = -1
   @HostListener('document:keydown.arrowdown', ['$event'])
   onKeydown(event: any) {
      if (!this.DropdownMenuActive) return
      // Prevent the default arrow-down behavior (e.g. scrolling the page)
      event.preventDefault()

      const elements = this.els.map(({ Id, El }) => ({ Id, El }))

      setTimeout(() => {
         if (this.CurrentListItem < this.DisplayableDataset.length - 1) {
            this.CurrentListItem++
            const listItem = this.DisplayableDataset[this.CurrentListItem]
            this.HoveredItem = listItem
            // Scroll element into view
            const telem = elements.find((el) => el.Id === this.CurrentListItem)

            if (telem) {
               const htmlEl: HTMLElement = telem.El
               htmlEl.scrollIntoView({
                  behavior: 'smooth',
                  block: 'end',
                  inline: 'nearest',
               })
            }
         }
      }, 0)
   }

   @HostListener('document:keydown.arrowup', ['$event'])
   onKeyup(event: any) {
      if (!this.DropdownMenuActive) return
      // Prevent the default arrow-down behavior (e.g. scrolling the page)
      event.preventDefault()

      const elements = this.els.map(({ Id, El }) => ({ Id, El }))

      setTimeout(() => {
         if (this.CurrentListItem > 0) {
            this.CurrentListItem--
            const listItem = this.DisplayableDataset[this.CurrentListItem]
            this.HoveredItem = listItem

            // Scroll element into view
            const telem = elements.find((el) => el.Id === this.CurrentListItem)

            if (telem) {
               const htmlEl: HTMLElement = telem.El
               htmlEl.scrollIntoView({
                  behavior: 'smooth',
                  block: 'end',
                  inline: 'nearest',
               })
            }
         }
      }, 0)
   }

   @HostListener('document:keydown.enter', ['$event.target'])
   onEnter() {
      if (!this.DropdownMenuActive) return

      if (this.HoveredItem) {
         this.selectDropdownItem(this.HoveredItem)
      }
      const focusedElement = document.activeElement as HTMLElement

      focusedElement.blur()
      this.closeDropdownMenu(this.PreviousValue)
   }

   // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
   ngOnInit() {
      this.requestComboboxData()
   }

   ngAfterViewInit() {
      this.Context.execCommandStack()
   }

   async searchObjectForInput(input: Event | string) {
      const inputString =
         typeof input === 'string'
            ? input
            : (input.target as HTMLInputElement).value
      this.Value.set(inputString)

      const searchResult = await uf_searchObject({
         Dataset: this.Context.Dataset,
         InputString: inputString,
      })

      this.DisplayableDataset = searchResult.Array
   }

   // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
   ngAfterContentInit() {
      for (const template of this.TemplateList) {
         switch (template.ID) {
            case 'placeholder':
               this.PlaceholderTemplate = template.template
               break
         }
      }
   }
   // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
   /**
    * Provide an CLComboboxItem and Id for scroll position
    * @param args
    */
   public async setDataI(args: ComboboxSetDataArgsI<T>) {
      this.Context.Dataset = args.dataset
      await this.searchObjectForInput(this.Value())
   }

   // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
   public async setData(args: ComboboxSetDataArgs<T>) {
      const dataset = new Array<ComboboxItemIFace<T>>()
      let id = 0
      for (const item of args.dataset) {
         dataset.push({ ItemData: item, Id: id, Exclude: false })
         id++
      }
      this.Context.Dataset = dataset
      console.log(this.Context.Dataset)
      await this.searchObjectForInput(this.Value())
   }

   // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
   requestComboboxData() {
      this.DisplayableDataset = []
      this.dataRequestEvent.emit({
         SetDataI: (args: ComboboxSetDataArgsI<T>) => {
            this.setDataI(args)
         },
         SetData: (args: ComboboxSetDataArgs<T>) => {
            this.setData(args)
         },
      })
   }

   // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
   selectDropdownItem(item: ComboboxItemIFace<T>) {
      // declare selected Item
      this.Value.set(this.PreviousValue)
      this.SelectedItem = item
      // emit new item
      this.itemSelectEvent.emit(this.SelectedItem.ItemData)
      this.closeDropdownMenu(this.Value())
   }

   // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
   clearSelectedItem() {
      if (!this.Disabled) {
         this.PreviousValue = ''
         this.SelectedItem = null
         this.Value.set('')
         this.clearValueEvent.emit(undefined)
         this.closeDropdownMenu(this.PreviousValue)
      }
   }

   // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
   openDropdownMenu() {
      this.HoveredItem = null
      if (this.Disabled) return
      // Calc if dropdown opens up or down
      if (this.Input) {
         const rect = this.Input.nativeElement.getBoundingClientRect()
         const inputOffset = rect.bottom
         const offsetTop = window.innerHeight - inputOffset
         const offsetBottomVH = (100 * offsetTop) / window.innerHeight
         this.DropdownDirection = offsetBottomVH >= 25 ? 'down' : 'up'
      }

      setTimeout(() => {
         this.CurrentListItem = -1
         if (this.SelectedItem) {
            this.CurrentListItem = this.DisplayableDataset.indexOf(
               this.SelectedItem
            )
         }
      }, 0)

      this.DropdownMenuActive = true
   }

   // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
   closeDropdownMenu(value: string) {
      this.DropdownMenuActive = false
      this.Value.set(value)
   }
   // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
   onMenuMouseDown() {
      // Set a flag to indicate that the user is still interacting with the dropdown menu
      // and it does not get closed by focusOout
      this.IsMenuInteracting = true
   }
}
