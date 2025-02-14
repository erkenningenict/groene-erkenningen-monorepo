// tailwind config is required for editor support

import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Pick<Config, "content" | "presets"> = {
  content: ["./src/**/*.tsx", "../../packages/ui/**/*.tsx"],
  presets: [sharedConfig],
};

export default config;
// export * from "@repo/ui/tailwind.config";
// const sharedConfig = require("@repo/ui/tailwind.config");

// module.exports = {
//   presets: [sharedConfig],
//   content: [
//     "./src/**/*.tsx",
//     // Add other relevant paths for this package
//   ],
//   theme: {
//     extend: {
//       // Package-specific theme extensions
//     },
//   },
//   plugins: [
//     // Package-specific plugins
//   ],
// };
