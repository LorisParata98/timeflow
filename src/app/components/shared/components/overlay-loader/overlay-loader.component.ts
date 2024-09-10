import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { LoaderStatusService } from '../../../../services/utils/loader-status.service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  standalone: true,
  selector: 'app-overlay-loader',
  templateUrl: './overlay-loader.component.html',
  styleUrls: ['./overlay-loader.component.scss'],
  imports: [SpinnerComponent],
})
export class OverlayLoaderComponent implements OnInit, OnDestroy {
  public isLoading = signal<boolean>(false);
  private readonly _unsubscribeAll = signal<Subject<void>>(new Subject());
  constructor(private _loaderService: LoaderStatusService) {
    this.isLoading.set(false);
  }

  ngOnInit(): void {
    this._loaderService.notify
      .pipe(takeUntil(this._unsubscribeAll()))
      .subscribe((status) => {
        this.isLoading.set(status);
      });
  }

  ngOnDestroy() {
    this._unsubscribeAll().next();
    this._unsubscribeAll().complete();
  }
}
