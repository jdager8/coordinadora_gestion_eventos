interface ResponseInterface {
  statusCode: number;
  message: string;
  error: boolean | null;
  data: any;
}

export { ResponseInterface };
