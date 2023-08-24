import { Component, computed, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import {
   ComboboxDataRequestIFace,
   ComboboxComponent,
   ComboboxContext,
   ComboboxItemDirective,
} from 'src/app/components/combobox'
import { NumberDirective, ProductionItemIFace } from '../shared'
import { MockupData } from './moqup-data/moq-data.const'
import { OrderService } from './data'
import { map } from 'rxjs'

@Component({
   selector: 'app-order-item',
   standalone: true,
   imports: [
      CommonModule,
      FormsModule,
      ComboboxComponent,
      ComboboxItemDirective,
      NumberDirective,
   ],
   templateUrl: './order-item.component.html',
   styleUrls: ['./order-item.component.scss'],
})
export class OrderItemComponent {
   public orderSer = inject(OrderService)

   public ComboboxContext = new ComboboxContext<ProductionItemIFace>()
   public Workpiece = signal('')
   public SelectedItem: ProductionItemIFace | undefined

   public workpieces$ = this.orderSer.productionItems$.pipe(map((item) => item))
   public order$ = this.orderSer.order$

   public WorkpieceAmount$ = computed(() => {
      return this.workpieces$.pipe(map((workpieces) => workpieces.length || 0))
   })

   public enableSwitching$ = computed(() => {
      return this.orderSer.selectedWorkpiece$.pipe(
         map(() => {
            console.log('test')
            const length = this.orderSer.productionItems$.getValue().length
            const position = this.orderSer.getIndex().valueOf()
            let ret = 3

            if (length === 1) {
               ret = 0
            } else if (position === length - 1) {
               ret = 2
            } else if (position === 0) {
               ret = 1
            }
            return ret
         })
      )
   })

   startOfWorkpieces$ = computed(() => {
      return this.orderSer.getIndex().valueOf() >= 1
   })

   public selectedWorkpiece$ = this.orderSer.selectedWorkpiece$.pipe(
      map((workpiece) => workpiece)
   )

   constructor() {}

   public selectWorkpieceCB(item: ProductionItemIFace) {
      this.SelectedItem = item
      if (item.Name) {
         this.Workpiece.set(item.Name)
      }
   }

   public requestWorkpieceCB(
      dataRequest: ComboboxDataRequestIFace<ProductionItemIFace>
   ) {
      dataRequest.SetData({ dataset: MockupData })
   }

   public clearWorkpieceCB() {
      this.SelectedItem = undefined
      this.Workpiece.set('')
   }

   public addWorkpiece() {
      if (this.SelectedItem) {
         this.orderSer.addItemToProduction(this.SelectedItem)
         this.clearWorkpieceCB()
      }
   }
}
