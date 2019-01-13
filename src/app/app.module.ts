///<reference path="../../node_modules/@angular/common/src/pipes/date_pipe.d.ts"/>
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {FormsModule} from '@angular/forms';
import {NavbarSellerComponent} from './navbar-seller/navbar-seller.component';
import {MenuSellerComponent} from './menu-seller/menu-seller.component';
import {MenuComponent} from './menu-seller/menu/menu.component';
import {SaleComponent} from './menu-seller/sale/sale.component';
import {HttpClientModule} from '@angular/common/http';
import {PopupComponent} from './modals/popup/popup.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ClientSearchComponent} from './menu-seller/sale/client-search/client-search.component';
import {AddToSaleComponent} from './menu-seller/sale/add-to-sale/add-to-sale.component';
import {FinishSaleComponent} from './menu-seller/sale/finish-sale/finish-sale.component';
import { LoadingMaskComponent } from './loading-mask/loading-mask.component';
import {StoreModule} from '@ngrx/store';
import {appReducers} from './store/reducers/app.reducers';
import { DiscountComponent } from './menu-seller/sale/discount/discount.component';
import { AddClientComponent } from './modals/add-client/add-client.component';
import {MaskDirective} from './directives/cpf-mask.directive';
import { SearchSaleComponent } from './menu-seller/search-sale/search-sale.component';
import { SaleDetailComponent } from './menu-seller/search-sale/sale-detail/sale-detail.component';
import {PopoverModule, TypeaheadModule} from 'ngx-bootstrap';
import { WithdrawComponent } from './menu-seller/withdraw/withdraw.component';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import { StockTransferComponent } from './menu-seller/stock-transfer/stock-transfer.component';
import { TaxCupomComponent } from './tax-cupom/tax-cupom.component';
import {
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule, MAT_DATE_LOCALE
} from '@angular/material';
import { ReportComponent } from './menu-seller/report/report.component';
import {DatePipe} from '@angular/common';
import { PaymentReportComponent } from './menu-seller/report/payment-report/payment-report.component';
import { ProductReportComponent } from './menu-seller/report/product-report/product-report.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        NavbarSellerComponent,
        MenuSellerComponent,
        MenuComponent,
        SaleComponent,
        PopupComponent,
        ClientSearchComponent,
        AddToSaleComponent,
        FinishSaleComponent,
        LoadingMaskComponent,
        DiscountComponent,
        AddClientComponent,
        MaskDirective,
        SearchSaleComponent,
        SaleDetailComponent,
        WithdrawComponent,
        StockTransferComponent,
        TaxCupomComponent,
        ReportComponent,
        PaymentReportComponent,
        ProductReportComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        MatDialogModule,
        BrowserAnimationsModule,
        StoreModule.forRoot(appReducers),
        MatDatepickerModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatInputModule,
        PopoverModule.forRoot(),
        CurrencyMaskModule,
        TypeaheadModule.forRoot()
    ],
    providers: [MatDialog, MatDatepickerModule, DatePipe, {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}],
    bootstrap: [AppComponent],
    entryComponents: [
        PopupComponent,
        DiscountComponent,
        AddClientComponent,
        SaleDetailComponent,
        WithdrawComponent
    ]
})
export class AppModule {
}
