import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {MenuSellerComponent} from './menu-seller/menu-seller.component';
import {MenuComponent} from './menu-seller/menu/menu.component';
import {SaleComponent} from './menu-seller/sale/sale.component';
import {SearchSaleComponent} from './menu-seller/search-sale/search-sale.component';
import {StockTransferComponent} from './menu-seller/stock-transfer/stock-transfer.component';

const appRoutes: Routes = [
    {
        path: 'seller', component: MenuSellerComponent, children: [
            {path: 'menu', component: MenuComponent},
            {path: 'search-sale', component: SearchSaleComponent},
            {path: 'stock-transfer', component: StockTransferComponent}
        ]
    },
    {path: 'sale', component: SaleComponent},
    {path: '', component: LoginComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
