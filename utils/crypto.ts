// @ts-ignore
import { encode, decode } from "uint8-to-base64";

function exgcd(a: bigint, b: bigint): [bigint, bigint, bigint] {
  if (b === 0n) return [a, 1n, 0n];
  const [d, x, y] = exgcd(b, a % b);
  return [d, y, x - (a / b) * y];
}

const MAGIC = 505420092905351854630322317919n;
const UNICODE_UPPER_BOUND = 0x10ffffn;
const MAGIC_MOD_INV = exgcd(MAGIC, UNICODE_UPPER_BOUND)[1];

/**
 * Encrypts a single character using the MAGIC constant
 * @param char A single character to encrypt
 * @returns Base64 encoded encrypted representation
 */
export function encrypt(char: string): string {
  if (!char) return "";

  if ([...char].length !== 1) {
    throw new Error("encrypt function only accepts a single character");
  }

  // Get Unicode code point
  const codePoint = BigInt(char.codePointAt(0) || 0);

  // Encrypt using the MAGIC number with modulo
  const encrypted = (codePoint * MAGIC) % UNICODE_UPPER_BOUND;

  // Convert to little-endian bytes
  const bytes = new Uint8Array(3); // 8 bytes for a bigint
  for (let i = 0; i < 3; i++) {
    bytes[i] = Number((encrypted >> BigInt(i * 8)) & 0xffn);
  }

  return encode(bytes);
}

/**
 * Decrypts a string encrypted by the encrypt function
 * @param encryptedStr Base64 encoded encrypted string
 * @returns Original character
 */
export function decrypt(encryptedStr: string): string {
  if (!encryptedStr) return "";
  // Decode base64 to bytes
  const bytes = decode(encryptedStr);

  // Convert little-endian bytes to bigint
  let value = 0n;
  for (let i = 0; i < bytes.length; i++) {
    value |= BigInt(bytes[i]) << BigInt(i * 8);
  }

  // Decrypt using modular inverse of MAGIC
  let decrypted = (value * MAGIC_MOD_INV) % UNICODE_UPPER_BOUND;

  // Fix negative modulo result if needed
  if (decrypted < 0n) {
    decrypted += UNICODE_UPPER_BOUND;
  }

  // Convert back to character
  const char = String.fromCodePoint(Number(decrypted));
  console.log(char);
  return char;
}
