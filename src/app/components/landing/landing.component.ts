import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as xml2js from 'xml2js';

import { UtilsService } from '../../services/utils.service';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  public images: Array<string> = [];

  constructor(
    private httpService: HttpClient,
    private utilsService: UtilsService
  ) {

  }

  ngOnInit(): void {
    this.getRandomImages();
  }

  public isFetching(): boolean {
    return this.images.length === 0;
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

        const shuffledImage = this.utilsService.shuffle(images);

        this.images = [
          shuffledImage[0],
          shuffledImage[1],
          shuffledImage[2],
          shuffledImage[3]
        ];
      });
    });
  }
}
