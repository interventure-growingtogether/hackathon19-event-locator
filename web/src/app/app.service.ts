import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class AppService {

  private url = 'http://localhost:3001';

  constructor(private http: HttpClient) {
  }

  public getSpaces(filters: any): Observable<any[]> {
    return this.http.get<any[]>(this.url + '/space', {params: {filters: btoa(JSON.stringify(filters))}});
  }

  public getSpace(spaceId): Observable<any> {
    return this.http.get<any>(this.url + '/space/' + spaceId);
  }

  public getUser(userId): Observable<any> {
    return this.http.get<any>(this.url + '/user/' + userId);
  }

  public getCities(): Observable<any[]> {
    return this.http.get<any[]>(this.url + '/city');
  }

  public reserve() {
    return this.http.post(this.url + '/reserve', null);
  }

  public getReviews(spaceId) {
    return this.http.get(this.url + '/review/' + spaceId);
  }

  public getUserReservations(userId) {
    return this.http.get(this.url + '/reserve/user/' + userId);
  }
}
