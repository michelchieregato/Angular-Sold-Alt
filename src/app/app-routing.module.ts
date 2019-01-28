import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {MenuSellerComponent} from './menu-seller/menu-seller.component';
import {MenuComponent} from './menu-seller/menu/menu.component';
import {SaleComponent} from './menu-seller/sale/sale.component';
import {SearchSaleComponent} from './menu-seller/search-sale/search-sale.component';
import {StockTransferComponent} from './menu-seller/stock-transfer/stock-transfer.component';
import {TaxCupomComponent} from './tax-cupom/tax-cupom.component';
import {ReportComponent} from './menu-seller/report/report.component';
import {PaymentReportComponent} from './menu-seller/report/payment-report/payment-report.component';
import {ProductReportComponent} from './menu-seller/report/product-report/product-report.component';
import {AddToSaleComponent} from './menu-seller/sale/add-to-sale/add-to-sale.component';
import {OrderComponent} from './menu-seller/sale/order/order.component';
import {CheckOrdersComponent} from './menu-seller/check-orders/check-orders.component';
import {SaleReportComponent} from './menu-seller/report/sale-report/sale-report.component';

const appRoutes: Routes = [
    {
        path: 'seller', component: MenuSellerComponent, children: [
            {path: 'menu', component: MenuComponent},
            {path: 'search-sale', component: SearchSaleComponent},
            {path: 'stock-transfer', component: StockTransferComponent},
            {path: 'report', component: ReportComponent},
            {path: 'check-orders', component: CheckOrdersComponent}
        ]
    },
    {
        path: 'sale', component: SaleComponent, children: [
            {path: 'new-sale', component: AddToSaleComponent},
            {path: 'order', component: OrderComponent}
        ],
    },
    {path: 'tax-cupom', component: TaxCupomComponent},
    {path: 'payment-report', component: PaymentReportComponent},
    {path: 'product-report', component: ProductReportComponent},
    {path: 'sale-report', component: SaleReportComponent},
    {path: '', component: LoginComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
