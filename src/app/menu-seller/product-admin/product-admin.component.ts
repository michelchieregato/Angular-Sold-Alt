import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {PopupComponent} from '../../modals/popup/popup.component';
import {SessionService} from '../../services/session.service';
import {AdminProduct, ProductAdminService} from '../../services/product-admin.service';
import {ADMIN_SIZES, ARCHIVE_PREFIX} from '../../constants/enums';
import {School} from '../../models/enum';
import {NewProductComponent} from './new-product/new-product.component';

interface SizeRow {
    id: number;
    size: string;
    price_cost: number;
    price_sell: number;
    originalCost: number;
    originalSell: number;
}

interface ProductGroup {
    name: string;
    archived: boolean;
    expanded: boolean;
    sizes: SizeRow[];
    saving: boolean;
    adding: boolean;
    addSizes: string[];
    addCost: number;
    addSell: number;
}

@Component({
    selector: 'app-product-admin',
    templateUrl: './product-admin.component.html',
    styleUrls: ['./product-admin.component.scss']
})
export class ProductAdminComponent implements OnInit {
    loading = true;
    schools = [
        {value: School.Pueri, label: 'Pueri Domus'},
        {value: School.Rio, label: 'Rio de Janeiro'},
    ];
    schoolSelected: School;
    search = '';
    showArchived = false;
    groups: ProductGroup[] = [];

    constructor(private adminService: ProductAdminService, private session: SessionService,
                public dialog: MatDialog) {
    }

    ngOnInit() {
        this.schoolSelected = this.session.getSchool();
        this.load();
    }

    load() {
        const expandedNames = this.groups.filter((group) => group.expanded).map((group) => group.name);
        this.loading = true;
        this.adminService.list(this.schoolSelected).subscribe(
            (products) => {
                this.groups = this.groupProducts(products);
                this.groups.forEach((group) => {
                    group.expanded = expandedNames.includes(group.name);
                });
                this.loading = false;
            },
            () => {
                this.loading = false;
                this.openPopup('sad', 'Erro', 'Não foi possível carregar os produtos. Verifique a conexão.');
            }
        );
    }

    changeSchool() {
        this.groups = [];
        this.load();
    }

    private emptyGroup(name: string): ProductGroup {
        return {
            name, archived: false, expanded: true, sizes: [],
            saving: false, adding: true, addSizes: [], addCost: null, addSell: null
        };
    }

    private groupProducts(products: AdminProduct[]): ProductGroup[] {
        const byName: { [name: string]: ProductGroup } = {};
        products.forEach((product) => {
            const archived = product.name.startsWith(ARCHIVE_PREFIX);
            const name = archived ? product.name.substring(ARCHIVE_PREFIX.length) : product.name;
            if (!byName[name]) {
                byName[name] = {...this.emptyGroup(name), archived, expanded: false, adding: false};
            }
            byName[name].sizes.push({
                id: product.id,
                size: product.size,
                price_cost: product.price_cost,
                price_sell: product.price_sell,
                originalCost: product.price_cost,
                originalSell: product.price_sell,
            });
        });

        const sizeOrder = (size: string) => {
            const index = ADMIN_SIZES.indexOf(size);
            return index === -1 ? ADMIN_SIZES.length : index;
        };

        return Object.keys(byName).sort().map((name) => {
            const group = byName[name];
            group.sizes.sort((a, b) => sizeOrder(a.size) - sizeOrder(b.size) || a.size.localeCompare(b.size));
            return group;
        });
    }

    get displayGroups(): ProductGroup[] {
        const query = this.search.trim().toLowerCase();
        return this.groups.filter((group) => {
            if (!this.showArchived && group.archived) {
                return false;
            }
            return !query || group.name.toLowerCase().includes(query);
        });
    }

    hasChanges(group: ProductGroup): boolean {
        return group.sizes.some((row) => this.isDirty(row));
    }

    isDirty(row: SizeRow): boolean {
        return row.price_sell !== row.originalSell || row.price_cost !== row.originalCost;
    }

    saveGroup(group: ProductGroup) {
        const updates = group.sizes.filter((row) => this.isDirty(row)).map((row) => ({
            id: row.id,
            price_sell: row.price_sell,
            price_cost: row.price_cost,
        }));
        if (!updates.length) {
            return;
        }

        group.saving = true;
        this.adminService.updatePrices(updates).subscribe(
            () => {
                group.saving = false;
                group.sizes.forEach((row) => {
                    row.originalSell = row.price_sell;
                    row.originalCost = row.price_cost;
                });
            },
            (error) => {
                group.saving = false;
                this.openPopup('sad', 'Erro ao salvar',
                    (error.error && error.error.error) || 'Não foi possível salvar os preços.');
            }
        );
    }

    discardGroup(group: ProductGroup) {
        group.sizes.forEach((row) => {
            row.price_sell = row.originalSell;
            row.price_cost = row.originalCost;
        });
    }

    // ---- adicionar tamanhos (o nome vem sempre do grupo — nunca é redigitado) ----

    availableSizes(group: ProductGroup): string[] {
        const used = group.sizes.map((row) => row.size);
        return ADMIN_SIZES.filter((size) => !used.includes(size));
    }

    startAdding(group: ProductGroup) {
        group.adding = true;
        group.addSizes = [];
        group.addCost = null;
        group.addSell = null;
    }

    cancelAdding(group: ProductGroup) {
        group.adding = false;
        // grupo recém-criado que ainda não tem nenhum tamanho salvo some da lista
        if (!group.sizes.length) {
            this.groups = this.groups.filter((other) => other !== group);
        }
    }

    toggleAddSize(group: ProductGroup, size: string) {
        const index = group.addSizes.indexOf(size);
        if (index === -1) {
            group.addSizes.push(size);
        } else {
            group.addSizes.splice(index, 1);
        }
    }

    canConfirmAdd(group: ProductGroup): boolean {
        return group.addSizes.length > 0
            && group.addCost !== null && group.addCost >= 0
            && group.addSell !== null && group.addSell > 0;
    }

    confirmAdd(group: ProductGroup) {
        if (!this.canConfirmAdd(group) || group.saving) {
            return;
        }
        const items = group.addSizes.map((size) => ({
            size, price_cost: group.addCost, price_sell: group.addSell
        }));

        group.saving = true;
        this.adminService.create(group.name, this.schoolSelected, items).subscribe(
            () => {
                group.saving = false;
                group.adding = false;
                this.load();
            },
            (error) => {
                group.saving = false;
                const body = (error.error || {});
                const text = body.conflicts && body.conflicts.length
                    ? 'Já existem estes tamanhos: ' + body.conflicts.join(', ')
                    : body.error || 'Não foi possível adicionar os tamanhos.';
                this.openPopup('sad', 'Erro', text);
            }
        );
    }

    removeSize(group: ProductGroup, row: SizeRow) {
        const modal = this.dialog.open(PopupComponent, {
            height: '400px',
            width: '500px',
            data: {
                type: 'ok-face',
                confirmation: true,
                title: 'Remover tamanho',
                text: `Remover o tamanho ${row.size} de "${group.name}"? ` +
                    'Só é possível remover tamanhos sem vendas registradas.'
            }
        });

        modal.afterClosed().subscribe((confirmed) => {
            if (!confirmed) {
                return;
            }
            this.adminService.deleteSize(row.id).subscribe(
                () => {
                    group.sizes = group.sizes.filter((other) => other !== row);
                    if (!group.sizes.length) {
                        this.groups = this.groups.filter((other) => other !== group);
                    }
                },
                (error) => {
                    this.openPopup('sad', 'Não foi possível remover',
                        (error.error && error.error.error) || 'Verifique a conexão.');
                }
            );
        });
    }

    toggleArchive(group: ProductGroup) {
        const action = group.archived ? 'desarquivar' : 'arquivar';
        const modal = this.dialog.open(PopupComponent, {
            height: '400px',
            width: '500px',
            data: {
                type: 'ok-face',
                confirmation: true,
                title: 'Confirmação',
                text: `Tem certeza que deseja ${action} "${group.name}" (todos os tamanhos)? ` +
                    'Produtos arquivados não aparecem na tela de venda.'
            }
        });

        modal.afterClosed().subscribe((confirmed) => {
            if (!confirmed) {
                return;
            }
            this.adminService.setArchived(group.name, this.schoolSelected, !group.archived).subscribe(
                () => {
                    group.archived = !group.archived;
                },
                (error) => {
                    this.openPopup('sad', 'Erro',
                        (error.error && error.error.error) || `Não foi possível ${action} o produto.`);
                }
            );
        });
    }

    openNewProductModal() {
        const modal = this.dialog.open(NewProductComponent, {
            width: '600px',
            data: {
                school: this.schoolSelected,
                existingNames: this.groups.map((group) => group.name),
            }
        });

        modal.afterClosed().subscribe((name: string) => {
            if (!name) {
                return;
            }
            const group = this.emptyGroup(name);
            this.groups = [group, ...this.groups];
            this.search = '';
            this.showArchived = this.showArchived || false;
        });
    }

    private openPopup(type: string, title: string, text: string) {
        this.dialog.open(PopupComponent, {
            height: '400px',
            width: '500px',
            data: {type, title, text}
        });
    }
}
