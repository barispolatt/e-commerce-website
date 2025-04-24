import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ConvertIsoToDatePipe<T extends Record<string, any>> implements PipeTransform<T, T>
{
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: T, _metadata: ArgumentMetadata): T {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return value;
    }
    const result = { ...value };
    for (const [key, val] of Object.entries(value)) {
      if (this.isIsoDate(val)) {
        (result as Record<string, any>)[key] = new Date(val);
      }
    }
    return result as unknown as T;
  }
  private isIsoDate(value: unknown): value is string {
    if (typeof value !== 'string') return false;
    const isoOnlyDateRegex = /^\d{4}-\d{2}-\d{2}/;
    return isoOnlyDateRegex.test(value) && !isNaN(Date.parse(value));
  }
}
