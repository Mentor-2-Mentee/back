import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class UserPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): any {
    const result = value.toLowerCase();
    console.log(result);

    if (!result) throw new Error("Invalidate ItemType");

    return result;
  }
}
