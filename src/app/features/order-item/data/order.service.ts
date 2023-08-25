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

   /**
    * @param item The item to be added to production.
    */
   public async addItemToProduction(item: ProductionItemIFace) {
      const currentArray = this.productionItems$.getValue()

      // Check if the item already exists in the array
      if (!currentArray.some((existingItem) => existingItem.ID === item.ID)) {
         item.Amount = 1
         // Add new item to array
         const updatedArray = [...currentArray, item]

         // Generate new Order if the array was empty
         if (currentArray.length <= 0) {
            this.order$.next({
               ID: (await uf_idGenerator({})).ID,
               Workpieces: new BehaviorSubject<ProductionItemIFace[]>([]),
            })
         }

         // Update Observables ** ORDER is IMPORTANT **
         this.order$.getValue()?.Workpieces?.next(updatedArray)
         this.productionItems$.next(updatedArray)
         this.selectWorkpiece(item)
      } else {
         this.selectWorkpiece(item)
      }
   }

   /**
    * @param item The item to be removed from production.
    */
   removeItemFromProdunction(item: ProductionItemIFace) {
      const updatedArticles = this.productionItems$
         .getValue()
         .filter((card: ProductionItemIFace) => card !== item)

      this.productionItems$.next(updatedArticles)
   }

   /**
    * Clears the production items.
    */
   clearProduction() {
      this.productionItems$.next([])
   }

   /**
    * Clears the orders, including workpiece and production items.
    */
   clearOrders() {
      this.clearWorkpiece()
      this.clearProduction()
      this.order$.next(null)
   }

   /**
    * Clears the selected workpiece.
    */
   clearWorkpiece() {
      this.selectedWorkpiece$.next(null)
   }

   /**
    * @param workpiece The workpiece to be selected.
    */
   selectWorkpiece(workpiece: ProductionItemIFace) {
      this.selectedWorkpiece$.next(workpiece)
   }

   /**
    * Selects the previous workpiece.
    */
   lastWorkpiece() {
      const currentIndex = this.getIndex()

      if (currentIndex > 0) {
         this.selectWorkpiece(
            this.productionItems$.getValue()[currentIndex - 1]
         )
      }
   }

   /**
    * Selects the next workpiece.
    */
   nextWorkpiece() {
      const currentIndex = this.getIndex()

      if (currentIndex < this.productionItems$.getValue().length - 1) {
         this.selectWorkpiece(
            this.productionItems$.getValue()[currentIndex + 1]
         )
      }
   }

   /**
    * @returns The index of the selected workpiece.
    */
   public getIndex(): number {
      const selectedWorkpiece = this.selectedWorkpiece$.getValue()
      if (!selectedWorkpiece) {
         return -1
      }

      return this.productionItems$.getValue().indexOf(selectedWorkpiece)
   }
}
