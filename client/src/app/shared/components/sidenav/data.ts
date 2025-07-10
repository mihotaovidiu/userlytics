import { MenuItem } from "primeng/api";
import { ROUTING_TERMS } from "../../../features/dashboard/statics";

export const MENU_ENTRIES: MenuItem[] = [
    {
        label: 'Dashboard',
        items: [
            {
                label: 'Users',
                icon: 'pi pi-users',
                routerLink: `${ROUTING_TERMS.USERS}`
            },
        ]
    }
];