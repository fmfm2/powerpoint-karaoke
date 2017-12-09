import { Injectable } from '@angular/core';


@Injectable()
export class UtilsService {
  constructor(
  ) { }

  public shuffle(array: Array<any>): Array<any> {
    let n = array.length, t, i;

    while (n) {
      i = Math.floor(Math.random() * n--);
      t = array[n];
      array[n] = array[i];
      array[i] = t;
    }

    return array;
  }

  public getRandom(array: Array<any>): any {
    return array[Math.floor(Math.random() * array.length)];
  }
}
