import { Routes } from '@angular/router';
import { AdminPanelComponent } from './Admin/admin-panel/admin-panel.component';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { adminGuard } from './_guards/admin.guard';
import { authGuard } from './_guards/auth.guard';
import { preventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { MemberDetailedResolver } from './_resolvers/member-detailed.resolver';

export const routes: Routes = [
    {path:'', component: HomeComponent},
    {
        path:'',
        runGuardsAndResolvers:'always',
        canActivate:[authGuard],
        children:[

            {path:'members', component: MemberListComponent},
            {path:'members/:username', component: MemberDetailComponent,resolve: {member:MemberDetailedResolver}},
            {path:'member/edit', component: MemberEditComponent, canDeactivate:[preventUnsavedChangesGuard]},
            {path:'lists', component: ListsComponent},
            {path:'messages', component: MessagesComponent},
            {path: 'admin', component: AdminPanelComponent, canActivate:[adminGuard]}
        ]
    },
    {path:'***', component: HomeComponent, pathMatch:'full'}
];
