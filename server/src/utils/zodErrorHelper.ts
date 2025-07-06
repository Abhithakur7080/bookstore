/**
 * Helper method to convert Zod validation errors into a key-value format
 */
export const extractZodErrors = (errors: any[]): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const err of errors) {
    if (err.path.length) result[err.path[0] as string] = err.message;
  }
  return result;
};
