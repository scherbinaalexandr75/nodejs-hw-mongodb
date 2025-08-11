export default function getEnvVar(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`ENV variable ${key} is missing`);
  }
  return value;
}
