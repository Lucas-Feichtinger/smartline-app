import { CLSearchObjectIFace } from './search-object.iface'
import { uf_searchObject } from './search-object.uf'

describe('SearchObjet', () => {
   const obj: CLSearchObjectIFace<any>[] = [{
      ItemData: {
         Name: "test",
         Age: 12
      },
      Id: 0,
      Exclude: false
   }]

   it('should test string', () => {
      uf_searchObject({
         InputString: "Test",
         Dataset: obj
      })
   })
})