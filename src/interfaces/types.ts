// src/interfaces/types.ts

// You can keep other interfaces here if needed
// For example:
export interface ApiResponse<T> {
    message: string;
    success: boolean;
    data?: T;
  }