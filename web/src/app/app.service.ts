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

  public getCities(): Observable<any[]> {
    return this.http.get<any[]>(this.url + '/city');
  }
}
