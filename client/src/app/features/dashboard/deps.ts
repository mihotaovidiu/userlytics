import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PanelModule } from 'primeng/panel';

import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { Logo, UserBox } from '../../shared/shared-components';
import { Sidenav } from '../../shared/shared-components';

const DASHBOARD_INTERNAL_DEPS = [
    Logo,
    UserBox,
    Sidenav,

]

const DASHBOARD_EXTERNAL_DEPS = [
    CommonModule,
    RouterModule,
    ToolbarModule,
    AvatarModule,
    ScrollPanelModule,
    PanelModule,
    ButtonModule,
    DividerModule,
]


export const DASHBOARD_MODULE_DEPS = [
    ...DASHBOARD_EXTERNAL_DEPS, ...DASHBOARD_INTERNAL_DEPS
]