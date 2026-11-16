/** Re-mounts on every navigation, giving each route a short fade-in. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-enter">{children}</div>;
}
