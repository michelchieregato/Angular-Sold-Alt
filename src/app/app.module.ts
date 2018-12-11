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
        LoadingMaskComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        MatDialogModule,
        BrowserAnimationsModule
    ],
    providers: [MatDialog],
    bootstrap: [AppComponent],
    entryComponents: [PopupComponent]
})
export class AppModule {
}
