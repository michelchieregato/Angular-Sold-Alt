import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {MenuSellerComponent} from './menu-seller/menu-seller.component';
import {MenuComponent} from './menu-seller/menu/menu.component';
import {SaleComponent} from './menu-seller/sale/sale.component';

const appRoutes: Routes = [
    {path: '', component: LoginComponent},
    {
        path: 'seller', component: MenuSellerComponent, children: [
            {path: 'menu', component: MenuComponent}
        ]
    },
    {path: 'sale', component: SaleComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
