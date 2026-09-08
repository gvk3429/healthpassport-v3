import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/healthpassport-v3/",
  plugins: [react()],
});