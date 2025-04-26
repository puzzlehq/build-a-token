export function asciiToU128(asciiString: string): string {
  let numericValue = BigInt(0);

  for (let i = 0; i < asciiString.length; i++) {
    // Shift the current numeric value left by 8 bits to make room for the new byte
    numericValue =
      (numericValue << BigInt(8)) | BigInt(asciiString.charCodeAt(i));
  }

  // Convert the BigInt to a string and append "u128"
  return numericValue.toString() + 'u128';
}
