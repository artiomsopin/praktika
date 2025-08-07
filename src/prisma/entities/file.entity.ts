import { ContentEntity } from './content.entity';

export interface FileEntity {
  file_name: string;
  file_type: string;
  size: string;
  modified: Date;
  content?: ContentEntity[];
}
