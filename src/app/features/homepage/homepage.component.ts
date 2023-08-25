import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLinkWithHref, RouterOutlet } from '@angular/router'
import { Title } from '@angular/platform-browser'
import {
   FormBuilder,
   FormsModule,
   ReactiveFormsModule,
   Validators,
} from '@angular/forms'
import { FakeBackendService } from 'src/app/services/fake-backend/fake-backend.service'
import { UserIFace } from 'src/app/interfaces'

@Component({
   standalone: true,
   imports: [
      CommonModule,
      FormsModule,
      RouterOutlet,
      RouterLinkWithHref,
      ReactiveFormsModule,
   ],
   selector: 'app-homepage',
   templateUrl: './homepage.component.html',
   styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent {
   private title = inject(Title)
   private formBuilder = inject(FormBuilder)
   private fakeBackendSer = inject(FakeBackendService)

   LoginForm = this.formBuilder.group({
      userId: ['', [Validators.required, Validators.minLength(5)]],
      password: [
         '',
         [
            Validators.required,
            Validators.minLength(5),
            Validators.pattern(/[A-ZÄÖÜ]/),
         ],
      ],
   })

   ngOnInit() {
      this.title.setTitle('SmartLine - Home')
   }

   constructor() {}

   public async onLogin() {
      const { userId, password } = this.LoginForm.value

      if (!userId || !password) {
         return
      }

      let resp = await this.fakeBackendSer.callLogin({
         Username: userId,
         Password: password,
      })

      const user: UserIFace = resp ? resp : ({} as UserIFace)

      console.log(user)
   }
}
