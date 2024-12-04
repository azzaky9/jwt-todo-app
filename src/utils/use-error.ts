import { SafeParseResult } from "valibot";

export function makeErrorObject({ issues }: SafeParseResult<any>) {
  const error = {} as { [key: string]: string };
  issues?.forEach((issue) => {
    const key = issue.path ? (issue.path[0].key as string) : "";
    error[key] = issue.message;
  });

  return error;
}
