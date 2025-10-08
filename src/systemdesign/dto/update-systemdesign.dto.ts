import { PartialType } from '@nestjs/mapped-types';
import { CreateSystemdesignDto } from './create-systemdesign.dto';

export class UpdateSystemdesignDto extends PartialType(CreateSystemdesignDto) {}
