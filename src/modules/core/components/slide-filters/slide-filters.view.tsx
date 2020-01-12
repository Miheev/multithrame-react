import * as stylesRaw from './slide-filters.module.scss';

import React, { ChangeEvent, Component, Fragment, ReactElement, SyntheticEvent } from 'react';
import { Form, FormField, RangeInput } from 'grommet';

import { AppConfig } from 'src/modules/shared/app.config';
import { AppStoreConnector } from 'src/modules/core/services/app-store.connector';
import { AutocompleteInput } from 'src/modules/core/components/autocomplete-input/autocomplete-input.component';
import { findDefaultOption } from 'src/modules/shared/utils/select';
import { SlideFiltersState, SlideFiltersViewProps } from './slide-filters.type';
import { StringMap, VideoCategory, VideoCountry, VideoFilterModel } from 'src/modules/shared/models';


const styles = stylesRaw as unknown as StringMap;

export class SlideFiltersView extends Component<SlideFiltersViewProps, SlideFiltersState> {
  readonly defaultCountry: VideoCountry;
  categoryList: VideoCategory[] = [AppConfig.defaultCategory];

  constructor(props: SlideFiltersViewProps) {
    super(props);

    this.state = {
      category: AppConfig.defaultCategory,
      videoCount: String(this.videoFilter.videosPerPage),
    };

    this.defaultCountry = findDefaultOption(this.videoFilter.country, this.countryList);

    this.onCountrySelected = this.onCountrySelected.bind(this);
    this.onCategorySelected = this.onCategorySelected.bind(this);
    this.onVideoCountSet = this.onVideoCountSet.bind(this);
    this.onVideoCountMove = this.onVideoCountMove.bind(this);
  }

  get countryList(): VideoCountry[] {
    return AppConfig.countryList;
  }

  private get videoFilter(): VideoFilterModel {
    return this.props.videoFilter;
  }

  private get appConnector(): AppStoreConnector {
    return this.props.appConnector;
  }

  componentDidMount(): void {
    this.updateCategory(this.videoFilter.country);
  }

  onCountrySelected(country: VideoCountry): void {
    this.updateCategory(country.value, true);
  }

  onCategorySelected(suggestion: VideoCategory): void {
    this.appConnector.videoFilterData = { category: suggestion.value };
  }

  onVideoCountMove(event: ChangeEvent<HTMLInputElement>): void {
    this.setState({ videoCount: event.target.value });
  }

  onVideoCountSet(event: SyntheticEvent<HTMLInputElement, MouseEvent | TouchEvent>): void {
    this.appConnector.videoFilterData = { videosPerPage: Number(event.currentTarget.value) };
  }

  render(): ReactElement {
    return (
      <Form className={styles['app-slide-filters']}>
        <AutocompleteInput label="Select Country"
                           id="country-filter"
                           name="country"
                           value={this.defaultCountry}
                           suggestions={this.countryList}
                           onSelect={this.onCountrySelected}
        />
        <AutocompleteInput label="Select Category"
                           id="category-filter"
                           name="category"
                           value={this.state.category}
                           suggestions={this.categoryList}
                           onSelect={this.onCategorySelected}
        />

        <FormField
          label={
            <Fragment>
              <span>Videos per page</span> <span className={styles['label-value']}>{this.state.videoCount}</span>
            </Fragment>
          }
          htmlFor="videos-per-page-filter"
          className={styles['videos-per-page']}>
          <RangeInput
            id="videos-per-page-filter"
            name="videosPerPage"
            a11yTitle="Videos per page"
            max={200}
            min={1}
            step={1}
            value={this.state.videoCount}
            onChange={this.onVideoCountMove}
            onMouseUp={this.onVideoCountSet}
            onTouchEnd={this.onVideoCountSet}
          />
        </FormField>
      </Form>
    );
  }

  private setCategories(categories: VideoCategory[]): void {
    this.categoryList = categories;
    this.categoryList.unshift(AppConfig.defaultCategory);
  }

  private updateCategory(countryId: string, updateFilters = false): void {
    this.appConnector.loadCategoriesForNewCountry(countryId).then(({ categories, selected }) => {
      this.setCategories(categories);
      this.setState({ category: selected });

      if (!updateFilters) {
        return;
      }

      this.appConnector.videoFilterData = {
        country: countryId,
        category: selected.value,
      };
    });
  }
}
