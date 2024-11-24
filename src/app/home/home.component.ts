import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/_services'; // Adjust the path as necessary

@Component({
  templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit {
  account: any;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.account = this.accountService.accountValue;
  }
}
