import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

const ERROR_MESSAGES = {
  required: 'Input is required.',
  email: 'Input is not an email address.',
  minlength: 'Input must be at least {0} characters long.'
};

const formatErrorMessage = (template: string, value: number): string =>
  template.replace(/{(\d+)}/g, value.toString());

@Component({
  selector: 'ql-error',
  standalone: true,
  template: `
    <div class="invalid-feedback">
      <i class="bi bi-x-circle"></i>
      {{ message }}
    </div>
  `,
  styles: [``],
  imports: [],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorComponent {
  @Input({ required: true })
  public error!: [string, any];

  public get message(): string | [string, any] {
    switch (this.error[0]) {
      case 'required':
        return ERROR_MESSAGES.required;
      case 'email':
        return ERROR_MESSAGES.email;
      case 'minlength':
        return formatErrorMessage(ERROR_MESSAGES.minlength, this.error[1]?.requiredLength);
      default:
        return this.error;
    }
  }
}
