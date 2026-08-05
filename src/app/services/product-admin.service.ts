import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {School} from '../models/enum';

const apiUrl = environment.apiUrl;

export interface AdminProduct {
    id: number;
    name: string;
    size: string;
    price_cost: number;
    price_sell: number;
}

export interface NewProductItem {
    size: string;
    price_cost: number;
    price_sell: number;
}

@Injectable({providedIn: 'root'})
export class ProductAdminService {

    constructor(private http: HttpClient) {
    }

    list(school: School) {
        return this.http.get<AdminProduct[]>(apiUrl + 'product/admin/', {params: {school} as any});
    }

    create(name: string, school: School, items: NewProductItem[]) {
        return this.http.post(apiUrl + 'product/admin/create/', {name, school, items});
    }

    updatePrices(updates: Array<{id: number, price_sell?: number, price_cost?: number}>) {
        return this.http.patch(apiUrl + 'product/admin/prices/', {updates});
    }

    setArchived(name: string, school: School, archived: boolean) {
        return this.http.post(apiUrl + 'product/admin/archive/', {name, school, archived});
    }

    deleteSize(id: number) {
        return this.http.delete(apiUrl + 'product/admin/delete/' + id + '/');
    }

    rename(name: string, school: School, newName: string) {
        return this.http.post(apiUrl + 'product/admin/rename/', {name, school, new_name: newName});
    }
}
