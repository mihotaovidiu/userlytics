import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { USERS_DEPENDENCIES } from './deps';
import {
  selectAllUsers,
  selectUsersLoading,
  selectUsersError,
  selectUsersPage,
  selectUsersPageSize,
  selectUsersTotal
} from '../../store/users/users.selectors';
import * as UsersActions from '../../store/users/users.actions';
import { selectAuthUser } from '../../store/auth/auth.selectors';
import { User } from '../../shared/shared-types';


@Component({
  selector: 'app-users',
  imports: [USERS_DEPENDENCIES],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users {
  users$: Observable<User[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  page$: Observable<number>;
  pageSize$: Observable<number>;
  total$: Observable<number>;
  authUser$: Observable<any>;

  isDialogOpen = false;
  searchTerm = '';
  selectedUser?: User;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private store: Store) {
    this.users$ = this.store.select(selectAllUsers);
    this.loading$ = this.store.select(selectUsersLoading);
    this.error$ = this.store.select(selectUsersError);
    this.page$ = this.store.select(selectUsersPage);
    this.pageSize$ = this.store.select(selectUsersPageSize);
    this.total$ = this.store.select(selectUsersTotal);
    this.authUser$ = this.store.select(selectAuthUser);


  }

  ngOnInit(): void {
    this.loadUsers(1, 10);
    this.watchSearchChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Emit a value to complete the observable          
    this.destroy$.complete(); // Complete the subject to avoid memory leaks
  }

  /**
   * Handler for search term changes.
   * @param term The search term
   */
  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  /**
   * Loads users from a data source (to be implemented).
   */
  loadUsers(page: number, pageSize: number, search?: string): void {
    this.store.dispatch(UsersActions.loadUsers({ page, pageSize, search }));
  }


  /**
   * Handler for editing an existing user. Opens the dialog in EDIT mode.
   * @param user The user to edit
   */
  onEditUser(user: User): void {
    this.selectedUser = user;
    this.openUserDialog();
  }

  /**
   * Handler for removing a user from the list.
   * @param user The user to remove
   */
  onRemoveUser(user: User): void {
    this.authUser$.pipe(takeUntil(this.destroy$)).subscribe(authUser => {
      if (authUser?.role === 'admin') {
        this.store.dispatch(UsersActions.deleteUser({ id: user.id }));
      }
    }).unsubscribe();
  }


  /**
   * Handler for page changes from the paginator.
   * @param event The pagination event containing first and rows
   */
  onPageChange(event: { first: number; rows: number }): void {
    const page = Math.floor(event.first / event.rows) + 1;
    this.loadUsers(page, event.rows);
  }

  /**
   * trackBy function for ngFor to optimize rendering.
   * @param index Index of the item
   * @param user The user object
   */
  trackByUserId(_index: number, user: User): any {
    return user.id;
  }

  /**
   * Opens the user dialog.
   */
  private openUserDialog(): void {
    this.isDialogOpen = true;
  }

  private watchSearchChanges(): void {
    this.searchSubject.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.loadUsers(1, 10, term);
    });
  }

}
