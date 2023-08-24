import { Injectable } from '@angular/core'
import { BehaviorSubject, map } from 'rxjs'
import { ProductionItemIFace } from '../../shared'
import { OrderInformationIFace } from '../../shared/interfaces/order-information.iface'
import { uf_idGenerator } from 'src/app/util-functions/id-generator/id-generator.uf'

@Injectable({
   providedIn: 'root',
})
export class OrderService {
   public productionItems$ = new BehaviorSubject<ProductionItemIFace[]>([])

   public order$ = new BehaviorSubject<Partial<OrderInformationIFace> | null>(
      null
   )

   public selectedWorkpiece$ = new BehaviorSubject<ProductionItemIFace | null>(
      null
   )

   constructor() {}

   public async addItemToProduction(item: ProductionItemIFace) {
      const currentArray = this.productionItems$.getValue()

      // Check if the item already exists in the array
      if (!currentArray.some((existingItem) => existingItem.ID === item.ID)) {
         item.Amount = 1
         const updatedArray = [...currentArray, item]

         if (currentArray.length <= 0) {
            this.order$.next({
               ID: (await uf_idGenerator({})).ID,
               Workpieces: new BehaviorSubject<ProductionItemIFace[]>([]),
            })
         }

         this.order$.getValue()?.Workpieces?.next(updatedArray)
         this.productionItems$.next(updatedArray)
         this.selectWorkpiece(item)
      } else {
         this.selectWorkpiece(item)
      }
   }

   removeItemFromProdunction(item: ProductionItemIFace) {
      const updatedArticles = this.productionItems$
         .getValue()
         .filter((card: ProductionItemIFace) => card !== item)

      this.productionItems$.next(updatedArticles)
   }

   clearProduction() {
      this.productionItems$.next([])
   }

   selectWorkpiece(workpiece: ProductionItemIFace) {
      this.selectedWorkpiece$.next(workpiece)
   }

   lastWorkpiece() {
      const currentIndex = this.getIndex()

      if (currentIndex > 0) {
         this.selectWorkpiece(
            this.productionItems$.getValue()[currentIndex - 1]
         )
      }
   }

   nextWorkpiece() {
      const currentIndex = this.getIndex()

      if (currentIndex < this.productionItems$.getValue().length - 1) {
         this.selectWorkpiece(
            this.productionItems$.getValue()[currentIndex + 1]
         )
      }
   }

   public getIndex(): number {
      const selectedWorkpiece = this.selectedWorkpiece$.getValue()
      if (!selectedWorkpiece) {
         return -1
      }

      return this.productionItems$.getValue().indexOf(selectedWorkpiece)
   }
}
