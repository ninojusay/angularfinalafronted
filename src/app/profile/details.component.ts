import { Component, OnInit } from '@angular/core';
import { AccountService, BranchService } from '@app/_services';
import { ActivityLog } from '@app/_models/activity-log.model';
import { Branch, Account } from '@app/_models'; // Import Branch and Account models

@Component({ templateUrl: 'details.component.html' })
export class DetailsComponent implements OnInit {
    account = this.accountService.accountValue;
    activityLogs: ActivityLog[] = [];
    branch: Branch | null = null; // Declare branch as null initially
    showActivityLogs = false;
    showBranchInfo: boolean = false;  // Controls visibility of branch info
    profilePicture: string = ''; // New variable for profile picture

    constructor(
        private accountService: AccountService,
        private branchService: BranchService // Use BranchService here
    ) { }

    ngOnInit(): void {
        // Initialize component
        if (this.account && this.account.id) {
            this.getActivityLogs(this.account.id);

            // Ensure the account has a branch and use the branch id to fetch the branch
            if (this.account.BranchId) {
                this.getBranchById(this.account.BranchId); // Use branchId from account
            } else {
                console.warn('No branchId assigned to account:', this.account.id);
            }

            // Load profile picture
            this.profilePicture = this.account.profilePicture || 'assets/default-profile.png'; // Default image
        }
    }

    getActivityLogs(AccountId: string): void {
        this.accountService.getActivityLogs(AccountId)
            .subscribe(
                (logs) => {
                    this.activityLogs = logs;
                },
                (error: any) => { // Explicitly type error as 'any'
                    console.error('Error fetching activity logs:', error);
                }
            );
    }

    getBranchById(BranchId: string): void {
        this.branchService.getBranchById(BranchId)
          .subscribe(
            (branch: Branch) => {
              this.branch = branch;
            },
            (error: any) => {
              console.error('Error fetching branch:', error);
            }
          );
    }

    toggleActivityLogs(): void {
        this.showActivityLogs = !this.showActivityLogs;
    }

    toggleBranchInfo() {
        this.showBranchInfo = !this.showBranchInfo;
    }

    isManager(): boolean {
        return this.account?.role === 'Manager'; // Check account role instead of branch
    }

    // Handle profile picture upload
    onPictureUpload(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                this.profilePicture = reader.result as string; // Update profile picture
                // Optionally, send this file to the server for storage
                this.uploadProfilePicture(file);
            };
            reader.readAsDataURL(file);
        }
    }

    // Method to upload the picture to the backend (add your API call logic here)
    uploadProfilePicture(file: File): void {
        // Example: this.accountService.uploadProfilePicture(file).subscribe(...);
        console.log('Uploading profile picture:', file);
    }
}
