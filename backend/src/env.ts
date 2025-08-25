type EnvType = "string" | "boolean" | "number";

type EnvMap = {
  string: string;
  boolean: boolean;
  number: number;
};

export function EnvLoader<T extends EnvType>(
  key: string,
  type: T,
  defaultValue?: EnvMap[T]
): EnvMap[T] {
  const raw = process.env[key];

  if (raw === undefined) {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Missing env var: ${key}`);
  }
  console.log("Env loaded successfully",key);
  
  switch (type) {
    case "boolean":
      return (raw === "true") as EnvMap[T];
    case "number":
      return Number(raw) as EnvMap[T];
    default:
      return raw as EnvMap[T];
  }
}