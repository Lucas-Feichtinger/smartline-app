// Angular
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs'
import { LoginIFace, UserIFace } from 'src/app/interfaces'
import { uf_tokenGenerator } from 'src/app/util-functions/token-generator/token-generator.uf'
import { UserRoleType } from '../../types'

@Injectable({
   providedIn: 'root',
})
export class FakeBackendService {
   public User$ = new BehaviorSubject<UserIFace | null>(null)

   public async callLogin(login: LoginIFace): Promise<UserIFace | null> {
      let user: Partial<UserIFace> = {}
      let role: UserRoleType = 'user'

      if (login.Password === 'Test123' && login.Username === 'LucasFei') {
         role = 'admin'
      } else if (login.Password === 'User123' && login.Username === 'EndUser') {
         role = 'user'
      } else {
         return null
      }

      user = {
         Role: role,
         Username: login.Username,
         Token: (await uf_tokenGenerator({ Length: 20 })).Token,
      }

      // Type assertion
      // const convertedUser: UserIFace = user as UserIFace
      this.User$.next(user as UserIFace)

      return firstValueFrom(this.User$.pipe())
   }
}
