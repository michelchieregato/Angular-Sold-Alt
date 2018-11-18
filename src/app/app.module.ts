import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {FormsModule} from '@angular/forms';
import {NavbarSellerComponent} from './navbar-seller/navbar-seller.component';
import {RouterModule, Routes} from '@angular/router';
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
    declarations: [
        AppComponent,
        LoginComponent,
        NavbarSellerComponent,
        MenuSellerComponent,
        MenuComponent,
        SaleComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        RouterModule.forRoot(appRoutes, {useHash: true})
    ],
    exports: [RouterModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
