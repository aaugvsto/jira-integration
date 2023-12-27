import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-jira-auth',
  standalone: true,
  imports: [],
  templateUrl: './jira-auth.component.html'
})
export class JiraAuthComponent implements OnInit {
  urlJiraAuth: string = 'https://auth.atlassian.com/authorize?audience=api.atlassian.com'
                        +'&client_id=6SihGWCyVSzEWGawW1wGP7tQwlva2GFc'
                        +'&scope=manage:jira-project%20manage:jira-configuration%20manage:jira-data-provider%20read:jira-work%20offline_access%20manage:jira-webhook%20write:jira-work%20read:me%20read:jira-user%20read:sprint:jira-software%20read:jql:jira%20read:issue-details:jira'
                        +'&redirect_uri=http%3A%2F%2Flocalhost%3A4200'
                        +`&state=${this.newGuid()}`
                        +'&response_type=code&prompt=consent';
  auth2AppClientId: string = '6SihGWCyVSzEWGawW1wGP7tQwlva2GFc';
  auth2AppClientSecret: string = 'ATOAh_av8FOZqscV0yrzJlXkYDtKWghvVsA9vw_3MAsqacx1e1V4FvJfUc1rRWvoDDrq860D1EE7';
  auth2AppClientRedirectUri: string = 'http://localhost:4200';
  loadingProjects: boolean = false;
  exibirBotao: boolean = true;    
  autenticando: boolean = false;
  projects: any[] = [];

  constructor(private activeRoute: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(params => {
      console.log(params["code"])
      if(params["code"] && (!localStorage.getItem('access_token') && !localStorage.getItem('refresh_token'))){
        this.exibirBotao = false;
        this.autenticando = true;

        this.authenticateUser(params["code"]).subscribe((response: any) => {
          console.log(response)
          this.autenticando = false;
          const acessToken: string = response.access_token

          localStorage.setItem('access_token', acessToken);
          localStorage.setItem('refresh_token', response.refresh_token);

          this.loadingProjects = true;

          this.getUserSites(acessToken).subscribe((userSites: any[]) => { 
            this.loadProjectsAvailableUser(userSites, acessToken);
          });
        });

        return;
      }
    });

    if(localStorage.getItem('access_token') && localStorage.getItem('refresh_token')){
      this.exibirBotao = false
      this.validateAcessToken().pipe( 
        catchError((err : any) => {
          if(err.status == 401)
            this.refreshAccessToken();
  
          return throwError(err);
        })
      ).subscribe((res: any) => {
        this.loadingProjects = true;
        this.getUserSites(localStorage.getItem('access_token')!).subscribe((userSites: any[]) => {
          this.loadProjectsAvailableUser(userSites, localStorage.getItem('access_token') || '');
          });
      });;
    }
  }

  private authenticateUser(code: string): Observable<any> {
    return this.http.post('https://auth.atlassian.com/oauth/token', {
      grant_type: 'authorization_code',
      client_id: this.auth2AppClientId,
      client_secret: this.auth2AppClientSecret,
      code: code,
      redirect_uri: this.auth2AppClientRedirectUri
    });
  }

  private getUserSites(access_token: string): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${access_token}`)
    return this.http.get('https://api.atlassian.com/oauth/token/accessible-resources', { headers });
  }

  private loadProjectsAvailableUser(userSites: any[], access_token: string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${access_token}`)
    userSites.forEach((site: any) => {
      this.http.get(`https://api.atlassian.com/ex/jira/${site.id}/rest/api/3/project`, { headers }).subscribe((res: any) => {
        this.projects = res;
        console.log(this.projects)
        this.loadingProjects = false;
      })
    });
  }

  private newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private validateAcessToken(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access_token')}`)
    return this.http.get('https://api.atlassian.com/me', { headers });
  }

  private refreshAccessToken() {
    this.http.post('https://auth.atlassian.com/oauth/token', {
      grant_type: 'refresh_token',
      client_id: this.auth2AppClientId,
      client_secret: this.auth2AppClientSecret,
      refresh_token: localStorage.getItem('refresh_token')
    }).subscribe((response: any) => {
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
    });
  }

  authWithJira() {
      window.open(this.urlJiraAuth, "_self");
  }

  logout() {
    localStorage.clear();
    window.open(window.location.origin, "_self");
  }
}
