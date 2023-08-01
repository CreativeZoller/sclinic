import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/modules/core/auth/services/auth.service';
import { environment } from '../../../../../../environments/environment';


@Component({
    selector: 'app-sidebar-footer',
    templateUrl: './sidebar-footer.component.html',
    styleUrls: ['./sidebar-footer.component.scss'],
})
export class SidebarFooterComponent {

    private authService = inject(AuthService);

    logout() {
        this.authService.logout();
    }
}
