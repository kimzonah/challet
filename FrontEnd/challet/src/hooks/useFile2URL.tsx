import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const useFile2URL = () => {
  const region = 'ap-northeast-2';
  const bucket = 'challetbucket';

  const s3 = new S3Client({
    region: region,
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    },
  });

  const file2URL = async (file: File) => {
    const params = {
      Bucket: bucket,
      Key: file.name,
      Body: file,
    };

    try {
      const command = new PutObjectCommand(params);
      const data = await s3.send(command);
      const fileURL = `https://${bucket}.s3.${region}.amazonaws.com/${file.name}`;
      console.log('Success uploading file:', data);
      console.log('File URL:', fileURL);
      return fileURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  return { file2URL };
};

export default useFile2URL;
