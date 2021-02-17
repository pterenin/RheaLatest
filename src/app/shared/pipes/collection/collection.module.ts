import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FilterOutByArrayAndPropertyPipe,
  MapByPropertyPipe,
  SearchInCollectionByPathsArrayPipe
} from './collection.pipe';

@NgModule({
  declarations: [
    FilterOutByArrayAndPropertyPipe,
    MapByPropertyPipe,
    SearchInCollectionByPathsArrayPipe
  ],
  imports: [CommonModule],
  exports: [
    FilterOutByArrayAndPropertyPipe,
    MapByPropertyPipe,
    SearchInCollectionByPathsArrayPipe
  ]
})
export class CollectionPipeModule {}
