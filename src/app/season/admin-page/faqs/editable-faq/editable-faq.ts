import {ChangeDetectionStrategy, Component, Input, QueryList, ViewChildren} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Faq, FaqsDao} from 'app/season/dao';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'editable-faq',
  styleUrls: ['editable-faq.scss'],
  templateUrl: 'editable-faq.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableFaq {
  @ViewChildren(CdkTextareaAutosize) textareas: QueryList<CdkTextareaAutosize>;

  @Input()
  set faq(faq: Faq) {
    this._faq = faq;
    this.form.get('question').setValue(faq.question, {emitEvent: false});
    this.form.get('answer').setValue(faq.answer, {emitEvent: false});
  }
  get faq(): Faq { return this._faq; }
  private _faq: Faq;

  form = new FormGroup({
    question: new FormControl(''),
    answer: new FormControl(''),
  });

  private _destroyed = new Subject();

  constructor(public faqsDao: FaqsDao) {
    this.form.valueChanges.pipe(
      debounceTime(500),
      takeUntil(this._destroyed))
      .subscribe(() => this.update());
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  ngAfterViewChecked() {
    if (this.textareas) {
      this.textareas.forEach(textarea => textarea.resizeToFitContent(true));
    }
  }

  update() {
    const formValues = this.form.value;

    if (!formValues.question || !formValues.answer) {
      return;
    }

    const update: Faq = {
      question: formValues.question,
      answer: formValues.answer,
    };

    this.faqsDao.update(this.faq.id, update);
  }

  delete() {
    this.faqsDao.remove(this.faq.id);
  }
}
