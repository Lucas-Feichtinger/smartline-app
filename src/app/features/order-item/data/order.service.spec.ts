import { TestBed } from '@angular/core/testing'

import { OrderService as OrderService } from './order.service'

describe('PrductionService', () => {
   let service: OrderService

   beforeEach(() => {
      TestBed.configureTestingModule({})
      service = TestBed.inject(OrderService)
   })

   it('should be created', () => {
      expect(service).toBeTruthy()
   })
})
