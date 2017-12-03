import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as xml2js from 'xml2js';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private items: Array<string> = [];
  public selected: string;
  public images: Array<string> = [];
  private currentSlideNumber: number = 0;

  constructor(
    private httpService: HttpClient
  ) {

  }

  ngOnInit(): void {
    this.fetchTrendWords();
    this.getRandomImages();

    this.bindKeyBoard();
  }

  public isFetching(): boolean {
    return this.items.length === 0 || this.images.length === 0;
  }

  private bindKeyBoard(): void {
    document.onkeydown = (e) => {
      if (e.code === 'ArrowRight' && !this.selected) {
        this.onSelect();
      } else if (this.currentSlideNumber === this.images.length + 1) {
        this.restart()
      } else {
        this.goToNext();
      }
    };
  }

  private fetchTrendWords(): void {
    const url = 'http://kizasi.jp/kizapi.py?type=rank';
    const target = `https://cors-allow.azurewebsites.net/?url=${url}`;

    this.httpService.get(target, {responseType: 'text'}).subscribe((data) => {
      xml2js.parseString(data, (response, result) => {
        let items = [];

        for ( let i = 0; i < result.rss.channel[0].item.length; i++) {
          items.push(result.rss.channel[0].item[i].title[0]);

          let relatedWords = result.rss.channel[0].item[i].description[0].replace(/.*の関連語:/, '').replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'').split(' ');

          for (let j = 0; j < relatedWords.length; j++) {
            items.push(relatedWords[j]);
          }
        }

        this.items = items;
      });
    });
  }

  public getRandomImages(): void {
    const url = 'http://api.flickr.com/services/feeds/photos_public.gne';
    const target = `https://cors-allow.azurewebsites.net/?url=${url}`;

    this.httpService.get(target, {responseType: 'text'}).subscribe((data) => {
      xml2js.parseString(data, (response, result) => {
        const entries = result.feed.entry;
        let images = [];

        for (let i = 0; i < entries.length; i++) {
          const image = entries[i].link.map((link) => {
            if (link.$.rel === 'enclosure') {
              images.push(link.$.href);
            }
          });
        }

        const shuffledImage = this.shuffle(images);

        this.images = [
          shuffledImage[0],
          shuffledImage[1],
          shuffledImage[2],
          shuffledImage[3],
          shuffledImage[4]
        ];
      });
    });
  }

  public onSelect(): void {
    this.selected = this.items[Math.floor(Math.random() * this.items.length)];
  }

  public goToNext(): void {
    const slides = document.getElementsByClassName('jsc-slide');
    const currentSlideNumber = this.currentSlideNumber;
    const currentSlide = <HTMLLIElement>slides[currentSlideNumber];
    const nextSlide = <HTMLLIElement>slides[this.currentSlideNumber + 1];

    if (!currentSlide || !nextSlide) return;

    currentSlide.style.display = 'none';
    nextSlide.style.display = 'block';

    this.currentSlideNumber++;
  }

  public restart(): void {
    location.reload();
  }

  private shuffle(array: Array<any>): Array<any> {
    let n = array.length, t, i;

    while (n) {
      i = Math.floor(Math.random() * n--);
      t = array[n];
      array[n] = array[i];
      array[i] = t;
    }

    return array;
  }
}
