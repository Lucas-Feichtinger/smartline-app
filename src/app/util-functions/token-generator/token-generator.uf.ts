import { RequestTokenGeneratorIFace } from './request.iface'
import { ResponseTokenGeneratorIFace } from './response.iface'

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
export async function uf_tokenGenerator(
   req: RequestTokenGeneratorIFace
): Promise<ResponseTokenGeneratorIFace> {
   const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
   let token = ''

   for (let i = 0; i < req.Length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      token += characters[randomIndex]
   }

   console.log(token)

   return {
      Token: token,
   }
}
