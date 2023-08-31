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

   public User: UserIFace | null = null
   public User$ = new BehaviorSubject<UserIFace>({} as UserIFace)

   public async getUser(): Promise<UserIFace | null> {
      await this.loadUserFromSession()

      if (this.User) {
         return this.User
      }
      return null
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
      if (this.User && this.User?.Token) {
         return true
      }
      return false
   }

   public storeUserToSession() {
      if (this.User) {
         const user = this.serialize(this.User)
         this.cacheSer.setJson('CurrentUser', user)
      }
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
