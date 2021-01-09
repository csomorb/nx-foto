import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';

export interface ApplicationUser {
	accessToken: string;
  expiresIn: Date;
  role: string;
	username: string;
}

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private currentUserSubject: BehaviorSubject<ApplicationUser>;
	public currentUser: Observable<ApplicationUser>;

	constructor(private readonly http: HttpClient,public toast: ToastrService) {
		this.currentUserSubject = new BehaviorSubject<ApplicationUser>(
			JSON.parse(localStorage.getItem('currentUser'))
		);
		this.currentUser = this.currentUserSubject.asObservable();
	}

	public get currentUserValue(): ApplicationUser {
		return this.currentUserSubject.value;
	}

	login(username: string, password: string) {
		return this.http.post<any>(environment.apiUrl+'/auth/login', { username, password }).pipe(
			map(user => {
				// login successful if there's a jwt token in the response
				if (user && user.accessToken) {
					// store; user; details; and; jwt; token in local
					// storage; to; keep; user; logged in between; page; refreshes;

					localStorage.setItem('currentUser', JSON.stringify(user));
					this.currentUserSubject.next(user);
				}

				return user;
			})
		);
  }

  register(username: string, password: string, email:string, role:string) {
		return this.http.post<any>(environment.apiUrl+'/auth/register', { username, password, email, role }).pipe(
			map(user => {
        console.log(user);
        this.toast.success(username,
          'Utilisateur créé',
          {timeOut: 3000,});
			})
		);
	}

	logout() {
		// remove user from local storage to log user out
		localStorage.removeItem('currentUser');
		this.currentUserSubject.next(null);
	}
}
