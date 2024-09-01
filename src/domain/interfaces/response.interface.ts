interface IResponse {
  statusCode: number;
  message: string;
  error: boolean | null;
  data: any;
}

export { IResponse };
