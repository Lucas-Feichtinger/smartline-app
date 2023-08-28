import { RequestSearchObjectIFace } from './request.iface'
import { ResponseSearchObjectIFace } from './response.iface'

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
export async function uf_searchObject<T>(
   req: RequestSearchObjectIFace<T>
): Promise<ResponseSearchObjectIFace> {
   const returnObject = []

   for (const item of req.Dataset) {
      // Reset the Exclude flag for each item
      item.Exclude = false

      const searchableBlockArray: string[] = []

      if (typeof item.ItemData === 'string') {
         // For strings, treat the entire string as searchable text
         searchableBlockArray.push(item.ItemData.toLowerCase())
      } else {
         // For custom types, extract searchable properties
         for (const prop in item.ItemData) {
            const value = (item.ItemData[prop] + '').toLowerCase()
            searchableBlockArray.push(value)
         }
      }

      let searchProbability = 0
      let inputWords = 0

      // Split the change string into an array of words
      const inputWordArray = req.InputString.match(/\b\w+\b/g)
      if (inputWordArray) {
         inputWords = inputWordArray.length

         // Iterate over each word in the change string
         outerLoop: for (const inputWord of inputWordArray) {
            // Iterate over each text block for the current item
            for (const textBlock of searchableBlockArray) {
               if (textBlock.length === 0) {
                  continue
               }

               if (
                  removeSeparationChars(textBlock).includes(
                     removeSeparationChars(inputWord)
                  )
               ) {
                  // If a match is found, increase the search probability and skip to the next word
                  searchProbability++
                  continue outerLoop
               }
            }
         }
      }

      if (inputWords === 0 || searchProbability >= inputWords) {
         // If the item meets the search criteria, add it to the DisplayableDataset
         returnObject.push(item)
      } else {
         // Otherwise, exclude the item
         item.Exclude = true
      }
   }

   return {
      Array: returnObject,
   }
}

function removeSeparationChars(text: string): string {
   text = text.replace(/[\,\,&]+/g, '')
   text = text.replace(/[\.\.&]+/g, '')
   text = text.replace(/[\ \ &]+/g, '')
   text = text.replace(/[\-\-&]+/g, '')
   return text.toLowerCase()
}
