

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | string[];
  details?: object[] | string[];
}


export type { ApiResponse, };
