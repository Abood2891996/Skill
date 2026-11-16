import { RouteTransition } from "@/components/motion/RouteTransition";

/** Re-mounts on every navigation; RouteTransition decides whether to fade. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <RouteTransition>{children}</RouteTransition>;
}
