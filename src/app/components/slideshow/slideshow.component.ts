import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as xml2js from 'xml2js';

import { UtilsService } from '../../services/utils.service';


@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.scss']
})
export class SlideshowComponent implements OnInit {
  public selected: string;

  private items: Array<string>;
  public images: Array<string>;
  private slideLength: number = 5;
  private currentSlideNumber: number;

  constructor(
    private httpService: HttpClient,
    private utilsService: UtilsService
  ) {

  }

  ngOnInit(): void {
    this.initialize();
    this.bindKeyBoard();
  }

  private initialize(): void {
    this.selected = '';
    this.items = [];
    this.images = [];
    this.currentSlideNumber = 0;

    this.fetchTrendWords();
    this.getRandomImages();
  }

  public isFetching(): boolean {
    return this.items.length === 0 || this.images.length === 0;
  }

  private bindKeyBoard(): void {
    document.onkeydown = (e) => {
      if (e.code === 'ArrowRight' && !this.selected) {
        this.onSelect();
      } else if (e.code === 'ArrowRight' && this.selected) {
        this.goToNext();
      } else if (this.currentSlideNumber === this.images.length + 1) {
        this.restart();
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

  private getRandomImages(): void {
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

        const shuffledImage = this.utilsService.shuffle(images);

        for (let i = 0; i < this.slideLength; i++) {
          this.images.push(shuffledImage[i]);
        }
      });
    });
  }

  public onSelect(): void {
    this.selected = this.utilsService.getRandom(this.items);
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
    this.initialize();
  }
}
