import * as crypto from "crypto";
// import fs from "fs/promises";
// import { USER_JSON_PATH } from "../constant/constant";

export function encodeBase64(data: string): string {
  return btoa(data);
}

export function decodeBase64(encodedData: string): string {
  return atob(encodedData);
}

export function generateSalt(length: number): string {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}

export function hashWithSalt(data: string, salt: string): string {
  const hash = crypto.createHmac("sha256", salt);
  hash.update(data);
  return hash.digest("hex");
}

export function verifyWithSalt(
  inputData: string,
  storedHash: string,
  salt: string
): boolean {
  const hashedInput = hashWithSalt(inputData, salt);
  return hashedInput === storedHash;
}

// (async () => {
//   const fileContent = await fs.readFile(USER_JSON_PATH, "utf-8");
//   const fileData: any[] = JSON.parse(fileContent);


//   const updatedData = fileData.map((user) => ({ ...user, password:hashWithSalt("1234", user.userKey) }));

//   await fs.writeFile(USER_JSON_PATH, JSON.stringify(updatedData, null, 2));
// })();
