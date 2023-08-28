// Angular
import { Injectable, inject } from '@angular/core'
import { UserIFace } from '../../interfaces'
import { BehaviorSubject } from 'rxjs'
import { CacheService } from '../cache'

@Injectable({
   providedIn: 'root',
})
export class UserService {
   // Services
   public cacheSer = inject(CacheService)

   public User: UserIFace = {} as UserIFace
   public User$ = new BehaviorSubject<UserIFace>({} as UserIFace)

   public async getUser(): Promise<UserIFace> {
      await this.loadUserFromSession()
      return this.User
   }

   public setUser(user: UserIFace) {
      this.User$.next(user as UserIFace)
      this.User = user
      this.storeUserToSession()
   }

   public deleteUser() {
      this.User$.next({} as UserIFace)
      this.User = {} as UserIFace
      this.clearUserSession()
   }

   public getLoginState(): boolean {
      if (this.User?.Token?.length > 0) {
         return true
      }
      return false
   }

   public storeUserToSession() {
      const user = this.serialize(this.User)
      this.cacheSer.setJson('CurrentUser', user)
   }

   public async loadUserFromSession() {
      const userJson = await this.cacheSer.getJson('CurrentUser')
      if (userJson) {
         const user = this.deSerialize(userJson) as UserIFace
         this.User$.next(user)
         this.User = user
      }
   }

   public clearUserSession() {
      sessionStorage.removeItem('CurrentUser')
   }

   public serialize(user: UserIFace): string {
      return JSON.stringify(user)
   }

   public deSerialize(serializedUser: string): UserIFace | null {
      try {
         return JSON.parse(serializedUser)
      } catch (error) {
         console.error('Error parsing serialized user:', error)
         return null
      }
   }
}
