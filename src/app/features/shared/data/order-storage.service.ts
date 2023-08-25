import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { OrderInformationIFace } from '../interfaces/order-information.iface'
import { ProductionItemIFace } from '../interfaces'

@Injectable({
   providedIn: 'root',
})
export class OrderStoreService {
   constructor() {}

   /**
    *
    * @param orders : Partial<OrderInformationIFace>[]
    * @returns String
    */
   serializeOrders(orders: Partial<OrderInformationIFace>[]): string {
      const plainOrders = orders.map((order) => {
         let deliveryDate = ''
         if (order.DeliveryDate) {
            deliveryDate = order.DeliveryDate?.toISOString()
         }

         return {
            ID: order.ID,
            Status: order.Status,
            DeliveryDate: deliveryDate,
            OrderAddress: order.OrderAddress,
            OrderPLZ: order.OrderPLZ,
            OrderStreet: order.OrderStreet,
            OrderHouse: order.OrderHouse,
            Priority: order.Priority,
            Workpieces: order.Workpieces?.getValue() || '',
         }
      })

      return JSON.stringify(plainOrders)
   }

   /**
    *
    * @param jsonString : string
    * @returns OrderIfnormationIFace[]
    */
   deserializeOrders(jsonString: string): Partial<OrderInformationIFace>[] {
      if (jsonString.length <= 0) {
         return []
      }

      const plainOrders: any[] = JSON.parse(jsonString)

      const orders: Partial<OrderInformationIFace>[] = plainOrders.map(
         (plainOrder) => {
            const order: Partial<OrderInformationIFace> = {
               ID: plainOrder.ID,
               Status: plainOrder.Status,
               DeliveryDate: new Date(plainOrder.DeliveryDate),
               OrderAddress: plainOrder.OrderAddress,
               OrderPLZ: plainOrder.OrderPLZ,
               OrderStreet: plainOrder.OrderStreet,
               OrderHouse: plainOrder.OrderHouse,
               Priority: plainOrder.Priority,
               Workpieces: new BehaviorSubject<ProductionItemIFace[]>(
                  plainOrder.Workpieces
               ),
            }
            return order
         }
      )

      return orders
   }
}
