// export type EnvType = "string" | "boolean" | "number";

// export interface EnvDataType {
//   string: string;
//   boolean: boolean;
//   number: number;
// }

// export function EnvLoader<T extends EnvType>(
//   key: string,
//   type: T,
//   // fallback?: EnvDataType[T]
// ): EnvDataType[T] {
//   const raw = import.meta.env[key] as string | undefined;

//   if (raw === undefined) {
//     if (fallback !== undefined) return fallback;
//     throw new Error(`Missing env variable: ${key}`);
//   }

//   switch (type) {
//     case "string":
//       return raw as EnvDataType[T];

//     case "boolean":
//       return (raw === "true") as EnvDataType[T];

//     case "number":
//       const num = Number(raw);
//       if (isNaN(num)) {
//         if (fallback !== undefined) return fallback;
//         throw new Error(`Invalid number for env variable: ${key}`);
//       }
//       return num as EnvDataType[T];

//     default:
//       throw new Error(`Unsupported type: ${type}`);
//   }
// }
