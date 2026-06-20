// CSS module type declarations for Next.js
declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.module.scss" {
  const classes: Record<string, string>;
  export default classes;
}

// Global CSS imports (e.g. import './globals.css')
declare module "*.css" {
  const content: string;
  export default content;
}
