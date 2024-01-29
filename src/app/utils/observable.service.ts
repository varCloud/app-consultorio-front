import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObservableService {
  public isLoading = new BehaviorSubject(false);

  constructor() {}
}
