import * as countries from './countries.json';
import { VideoCountry } from 'src/modules/shared/models';

export const AppConfig = {
  youtubeApiKey: 'AIzaSyA7hLSvwIpd6eaHCdQHQyf42hYwVlgjUQQ',
  commonParts: 'snippet, statistics',
  baseParts: 'snippet',
  chart: 'mostPopular',
  defaultRegion: 'US',
  defaultCategoryId: '10',
  defaultVideosPerPage: 24,
  maxVideosToLoad: 50,

  defaultCategory: { label: 'All', value: '' },
  countryList: (countries['default'] as VideoCountry[]),
  maxSelectOptions: 10,
};
