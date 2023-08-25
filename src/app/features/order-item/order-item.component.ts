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
import { firstValueFrom, map, tap } from 'rxjs'
import { CacheService } from 'src/app/services/cache/cache.service'
import { OrderInformationIFace } from '../shared/interfaces/order-information.iface'
import { OrderStoreService } from '../shared/data/order-storage.service'
import { Title } from '@angular/platform-browser'

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
   // Services
   public orderSer = inject(OrderService)
   public orderStoreSer = inject(OrderStoreService)
   public cacheSer = inject(CacheService)
   private title = inject(Title)

   // Combobox Component
   public ComboboxContext = new ComboboxContext<ProductionItemIFace>()
   public WorkpieceValue = signal('')
   public SelectedItem: ProductionItemIFace | undefined

   // a list of all available workpieces
   public workpieceList$ = this.orderSer.productionItems$.pipe(
      map((item) => item)
   )
   // Used to display the amount of currently selected Workpieces
   public order$ = this.orderSer.order$.pipe(map((order) => order))

   // Used to display the amount of currently selected Workpieces
   public WorkpieceAmount$ = computed(() => {
      return this.selectedWorkpiece$.pipe(
         map((workpieces) => {
            return `At Workpiece ${this.orderSer.getIndex().valueOf() + 1}/${
               this.orderSer.productionItems$.getValue().length
            }`
         })
      )
   })

   // Observale Number what directions are available
   public switchDirection$ = computed(() => {
      return this.orderSer.selectedWorkpiece$.pipe(
         map(() => {
            const length = this.orderSer.productionItems$.getValue().length
            const position = this.orderSer.getIndex().valueOf()

            if (length === 1) {
               // no directions
               return 0
            } else if (position === length - 1) {
               // switch left available
               return 2
            } else if (position === 0) {
               // switch right available
               return 1
            }
            // Both directions
            return 3
         })
      )
   })

   public selectedWorkpiece$ = this.orderSer.selectedWorkpiece$.pipe(
      map((workpiece) => {
         return workpiece
      })
   )

   constructor() {}

   ngOnInit() {
      this.title.setTitle('SmartLine - Order')
   }

   public async addWorkpiece() {
      if (this.SelectedItem) {
         // Spread to not Update the Mockup Data with Inputs
         await this.orderSer.addItemToProduction({ ...this.SelectedItem })
         this.clearWorkpieceCB()
      }
      const orderID = await firstValueFrom(this.order$)
      this.title.setTitle('SmartLine - Order: ' + orderID?.ID)
   }

   public async createOrder() {
      const subscription = this.order$.subscribe(async (order) => {
         // Get List of Orders from Storage
         const orderStr = (await this.cacheSer.getStringLocal('Order')) || ''
         let orders: Partial<OrderInformationIFace>[] =
            this.orderStoreSer.deserializeOrders(orderStr) || []

         // Add new order to List
         if (order) {
            orders.push(order)
         }
         // Push updated List Storage
         this.cacheSer.setStringLocal('Order', JSON.stringify(orders))
         this.orderSer.clearOrders()
      })

      // To unsubscribe, call unsubscribe when needed (e.g., in ngOnDestroy)
      subscription.unsubscribe()
   }

   // --- COMBOBOX: BEG ---
   public selectWorkpieceCB(item: ProductionItemIFace) {
      this.SelectedItem = item
      if (item.Name) {
         this.WorkpieceValue.set(item.Name)
      }
   }

   public requestWorkpieceCB(
      dataRequest: ComboboxDataRequestIFace<ProductionItemIFace>
   ) {
      dataRequest.SetData({ dataset: MockupData })
   }

   public clearWorkpieceCB() {
      this.SelectedItem = undefined
      this.WorkpieceValue.set('')
   }
}
