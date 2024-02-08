import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { newId } from './id';

export interface UploadBody {
  studentID: string;
  documentID?: string;
}

export interface UploadMetadata {
  fileUrl: string;
  contentType: string;
  size: number;
  name?: string;
  studentID?: string;
  documentID?: string;
}

class S3Handler {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: 'us-east-2',
      credentials: {
        accessKeyId: 'AKIAUWHUFD3XCENJWZP5',
        secretAccessKey: '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'
      }
    });
  }

  async uploadToS3(file: File, body: UploadBody): Promise<UploadMetadata> {
    const documentID = body.documentID || file.name;
    const newFileName = `${body.studentID}/${documentID}`;

    const uploadParams = {
      Bucket: 'shepherd-document-upload',
      Key: newFileName,
      Body: file,
      ContentType: file.type
    };

    await new Upload({
      client: this.s3,
      params: uploadParams
    }).done();

    const fileUrl = `https://shepherd-document-upload.s3.us-east-2.amazonaws.com/${newFileName}`;

    return {
      studentID: body.studentID,
      documentID,
      fileUrl,
      contentType: file.type,
      size: file.size
    };
  }

  async uploadBase64ToS3(base64: string, contentType: string): Promise<string> {
    const key = newId('temp');

    const uploadParams = {
      Bucket: 'shepherd-document-upload',
      Key: key,
      Body: base64,
      ContentType: contentType
    };

    await new Upload({
      client: this.s3,
      params: uploadParams
    }).done();
    const fileUrl = `https://shepherd-document-upload.s3.us-east-2.amazonaws.com/${key}`;

    return fileUrl;
  }
}

export default S3Handler;
