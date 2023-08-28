import { NgModule } from '@angular/core'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'
import { LayoutComponent } from './components/layout/layout.component'

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
            loadComponent: () =>
               import('./features').then((mod) => mod.HomepageComponent),
         },
         {
            path: 'production-management',
            loadComponent: () =>
               import('./features').then(
                  (mod) => mod.ProductionManagementComponent
               ),
         },
         {
            path: 'order-item',
            loadComponent: () =>
               import('./features').then((mod) => mod.OrderItemComponent),
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
