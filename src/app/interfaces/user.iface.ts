import { UserRoleType } from '../types'

export interface UserIFace {
   Username: string
   Role: UserRoleType

   Token: string | undefined
}
