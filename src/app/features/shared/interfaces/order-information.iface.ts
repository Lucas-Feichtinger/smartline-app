import { BehaviorSubject } from 'rxjs'
import { ProductionStateType } from '../types'
import { ProductionItemIFace } from './production-item.iface'

export interface OrderInformationIFace {
   ID: string
   Status: ProductionStateType
   DeliveryDate: Date
   OrderAddress: string
   OrderPLZ: number
   OrderStreet: string
   OrderHouse: number
   Priority: boolean

   Workpieces: BehaviorSubject<ProductionItemIFace[]>
}
