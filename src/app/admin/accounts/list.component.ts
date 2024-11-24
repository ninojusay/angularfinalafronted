import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    accounts?: any[];  // List of all accounts
    searchQuery: string = '';  // Search query string

    constructor(private accountService: AccountService) { }

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(accounts => this.accounts = accounts);
    }

    // Filter accounts based on search query
    get filteredAccounts() {
        return this.accounts?.filter(account =>
            (`${account.title} ${account.firstName} ${account.lastName}`.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            account.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            account.role.toLowerCase().includes(this.searchQuery.toLowerCase()))
        ) || [];
    }

    deleteAccount(id: string) {
        const account = this.accounts!.find(x => x.id === id);
        if (account) {
            account.isDeleting = true;
            this.accountService.delete(id)
                .pipe(first())
                .subscribe(() => {
                    this.accounts = this.accounts!.filter(x => x.id !== id);
                });
        }
    }
}
