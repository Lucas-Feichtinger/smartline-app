import { NgModule } from '@angular/core'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'
import { LayoutComponent } from './components/layout/layout.component'
import {
   HomepageComponent,
   OrderItemComponent,
   ProductionManagementComponent,
} from './features'

const routes: Routes = [
   {
      path: '',
      redirectTo: 'homepage',
      pathMatch: 'full',
   },
   {
      path: '',
      // canActivate: [],
      component: LayoutComponent,
      children: [
         {
            path: 'homepage',
            // canActivate: [],
            component: HomepageComponent,
            // loadChildren: () =>
            //    import('./features').then((m) => m.HomepageComponent),
         },
         {
            path: 'production-management',
            // canActivate: [],
            component: ProductionManagementComponent,
            // loadChildren: () =>
            //    import('./features').then(
            //       (m) => m.ProductionManagementComponent
            //    ),
         },
         {
            path: 'order-item',
            // canActivate: [],
            component: OrderItemComponent,
            // loadChildren: () =>
            //    import('./features').then(
            //       (m) => m.ProductionManagementComponent
            //    ),
         },
      ],
   },
]

@NgModule({
   imports: [
      // , onSameUrlNavigation: 'reload'
      RouterModule.forRoot(routes, {
         preloadingStrategy: PreloadAllModules,
         scrollPositionRestoration: 'enabled',
         useHash: true,
      }),
   ],
   exports: [RouterModule],
})
export class AppRoutingModule {}
