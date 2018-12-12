import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Faq, FaqsDao} from 'app/season/dao';

@Component({
  selector: 'editable-faq',
  styleUrls: ['editable-faq.scss'],
  templateUrl: 'editable-faq.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableFaq {
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

  constructor(public faqsDao: FaqsDao) {
    this.form.valueChanges.subscribe(() => this.update());
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
