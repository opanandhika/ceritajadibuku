import type { NextConfig } from "next";
import { validateEnvironment } from "./src/lib/environment";

validateEnvironment(process.env);
const config: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  devIndicators: false,
};
export default config;
