import {
   Component,
   OnInit,
   effect,
   inject,
   signal,
   untracked,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLinkWithHref, RouterOutlet } from '@angular/router'
import { Title } from '@angular/platform-browser'
import {
   FormBuilder,
   FormsModule,
   ReactiveFormsModule,
   Validators,
} from '@angular/forms'
import { UserIFace } from 'src/app/interfaces'
import { LoadingCircleComponent } from 'src/app/components/loading-circle'
import { UserService, FakeBackendService } from 'src/app/services'

@Component({
   standalone: true,
   imports: [
      CommonModule,
      FormsModule,
      RouterOutlet,
      RouterLinkWithHref,
      ReactiveFormsModule,
      LoadingCircleComponent,
   ],
   selector: 'app-homepage',
   templateUrl: './homepage.component.html',
   styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
   private title = inject(Title)
   private formBuilder = inject(FormBuilder)
   private fakeBackendSer = inject(FakeBackendService)
   private userSer = inject(UserService)

   public LoginState = signal(false)
   public AwaitingLogin = signal(false)

   LoginForm = this.formBuilder.group(
      {
         userId: ['', [Validators.required, Validators.minLength(5)]],
         password: [
            '',
            [
               Validators.required,
               Validators.minLength(5),
               Validators.pattern(/[A-ZÄÖÜ]/),
            ],
         ],
      },
      {
         updateOn: 'submit',
      }
   )

   ngOnInit() {
      this.title.setTitle('SmartLine - Home')
      this.LoginState.set(this.userSer.getLoginState())
   }

   constructor() {
      effect(() => {
         untracked(() => this.AwaitingLogin())

         this.LoginForm
      })
   }

   public async onLogin() {
      this.AwaitingLogin.set(true)
      const { userId, password } = this.LoginForm.value

      if (!userId || !password) {
         return
      }

      const resp = await this.fakeBackendSer.callLogin({
         Username: userId,
         Password: password,
      })

      const user: UserIFace = resp ? resp : ({} as UserIFace)

      this.userSer.setUser(user)
      this.AwaitingLogin.set(false)
      this.LoginState.set(true)
   }
}
