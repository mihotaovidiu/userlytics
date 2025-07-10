import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { UserDialog } from "./components/user-dialog/user-dialog";
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';

const USERS_EXTERNAL_DEPS = [
    CommonModule, ButtonModule, DataViewModule, InputTextModule, IftaLabelModule, AvatarModule, DividerModule, UserDialog, SkeletonModule, FormsModule
]
const USERS_INTERNAL_DEPS = [UserDialog]
export const USERS_DEPENDENCIES = [
    ...USERS_EXTERNAL_DEPS, ...USERS_INTERNAL_DEPS
]