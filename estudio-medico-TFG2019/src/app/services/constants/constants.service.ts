import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  constructor() { }

  readonly localHost: string = '194.31.52.72';
  readonly remoteHost: string = '194.31.52.72';
}
