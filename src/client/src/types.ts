export type VideoType = {
  dimensions: {
    width: number;
    height: number;
  };
  _id: string;
  videoId: string;
  user: {
    _id: string;
    username: string;
    __v: number;
  };
  name: string;
  extension: string;
  extractedAudio: boolean;
  resizes: [
    {
      dimensions: string;
      processing: boolean;
      _id: string;
    }
  ];
  __v: number;
};
