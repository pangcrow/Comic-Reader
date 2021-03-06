import { api } from './api';
import { GetComicDataParam, Chapters, ComicData } from '../../../../typing';

const chineseConv = require('chinese-conv'); // tslint:disable-line
const LZString = require('./utils/LZString'); // tslint:disable-line

export async function getComicData({
  comicID
}: GetComicDataParam): Promise<ComicData> {
  try {
    const { data: $ } = await api.get(`/comic/${comicID}/`);

    const cover = $('.hcover img').attr('src');
    const latest = $('.hcover .text')
      .text()
      .trim();
    const finished = !$('.hcover .serial').length;
    const intro = $('.book-intro #intro-all')
      .text()
      .trim();
    const title = $('.book-title')
      .children()
      .map((index: number, c: CheerioElement) => $(c).text())
      .toArray();

    const adultOnly = !!$('#checkAdult').length;

    const details = $('.detail-list li > span')
      .map((index: number, details: CheerioElement) => {
        const $val = $(details)
          .contents()
          .filter(
            (index: number, el: CheerioElement) => el.tagName !== 'strong'
          );

        return {
          key: $(details)
            .find('strong')
            .text(),
          val: $val
            .map((index: number, el: CheerioElement) => {
              const text = $(el).text();
              // FIXME:
              // @ts-ignore
              if (el.nodeType === 3) {
                return text;
              }
              return `<span>${text}</span>`;
            })
            .toArray()
            .join('')
        };
      })
      .toArray();

    if (adultOnly || $('.warning-bar')) {
      try {
        $('#erroraudit_show').replaceWith(
          $(LZString.decompressFromBase64($('#__VIEWSTATE').attr('value')))
        );
      } catch (err) {
        console.log(err); // tslint:disable-line
      }
    }

    const chapters: Chapters = {};

    $('.chapter')
      .children()
      .each((index: number, child: CheerioElement) => {
        if ($(child).get(0).tagName === 'h4') {
          let $el = $(child);
          while (!$el.next().hasClass('chapter-list')) {
            $el = $el.next();
          }

          let arr: CheerioElement[] = [];
          const $ul = $el.next().find('ul');

          for (let i = $ul.length - 1; i >= 0; i--) {
            arr = [
              ...arr,
              ...$($ul[i])
                .find('li')
                .toArray()
            ];
          }

          const chapterType = chineseConv.tify($(child).text());

          chapters[chapterType] = arr.map(chapter => {
            const $aTag = $(chapter).find('a');

            return {
              chapterID: $aTag
                .attr('href')
                .replace(/.*\/(?=[^\/].*$)|.html/g, ''),
              title: chineseConv.tify($aTag.attr('title')),
              p: $aTag.find('i').text(),
              isNew: !!$(chapter).find('.new').length
            };
          });
        }
      });

    return {
      comicID,
      cover,
      latest,
      finished,
      intro,
      title,
      details,
      chapters,
      adultOnly,
      name: title[0],
      updateTime: $('.detail-list li > span span:nth-of-type(2)').text()
    };
  } catch (err) {
    return Promise.reject({
      response: {
        status: '',
        statusText: err
      }
    });
  }
}
