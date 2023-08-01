import { Component, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest } from 'rxjs';

export class PaginationConfig {
  constructor(public currentSelectedPage: number, public rowsPerPage: number) {}
}


@UntilDestroy()
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() numberOfPages = 5;
  @Output() pageConfigChanged = new EventEmitter<PaginationConfig>();

  public totalRecordCount$ = new BehaviorSubject<number>(20);
  public rowsPerPageOptions: number[] = [10, 20, 30, 40];
  private pageConfiguration$ = new BehaviorSubject<PaginationConfig>(new PaginationConfig(1, 10));
  pageConfig: PaginationConfig;

  constructor(private cdr: ChangeDetectorRef) {
    combineLatest([this.totalRecordCount$, this.pageConfiguration$])
        .pipe(untilDestroyed(this)).subscribe(([totalRecordCount, pageConfiguration]) => {
      this.pageConfig = pageConfiguration;
      this.numberOfPages = Math.ceil(totalRecordCount / pageConfiguration.rowsPerPage);
      this.cdr.markForCheck();
    });
  }

  @Input()
  set totalRecordCount(value: number) {
    this.totalRecordCount$.next(value);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.numberOfPages) {
      this.pageConfig.currentSelectedPage = page;
      this.pageConfigChanged.emit(this.pageConfig);
    }
  }

  public get selectedRowsPerPage(): number {
    return this.pageConfig.rowsPerPage;
  }

  public set selectedRowsPerPage(value: number) {
    this.pageConfig.rowsPerPage = value;
    this.pageConfiguration$.next({
      ...this.pageConfig,
      rowsPerPage: value
    });
    this.onPageChange(1);
  }
}
