import { Routes } from '@angular/router';
import { JiraAuthComponent } from './jira-auth/jira-auth.component';
import { RichTextComponent } from './rich-text/rich-text.component';

export const routes: Routes = [
    {
        path: '',
        component: JiraAuthComponent
    },
    {
        path: 'rich-text',
        component: RichTextComponent
    }
];
