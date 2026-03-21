type ValidationDetailItem = {
  loc?: Array<string | number>;
  msg?: string;
  type?: string;
};

type ApiErrorPayload = {
  detail?: string | ValidationDetailItem[] | unknown;
};

function isValidationDetailItem(value: unknown): value is ValidationDetailItem {
  return typeof value === "object" && value !== null;
}

export async function getApiErrorMessage(
  response: Response,
  fallbackMessage: string,
) {
  try {
    const payload = (await response.json()) as ApiErrorPayload;
    const detail = payload?.detail;

    if (typeof detail === "string" && detail.trim()) {
      return detail;
    }

    if (Array.isArray(detail)) {
      const messages = detail
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          if (isValidationDetailItem(item) && typeof item.msg === "string") {
            return item.msg;
          }

          return null;
        })
        .filter((message): message is string => Boolean(message?.trim()));

      if (messages.length > 0) {
        return messages.join("\n");
      }
    }
  } catch {
    return fallbackMessage;
  }

  return fallbackMessage;
}

export async function throwApiError(
  response: Response,
  fallbackMessage: string,
): Promise<never> {
  const message = await getApiErrorMessage(response, fallbackMessage);
  throw new Error(message);
}
