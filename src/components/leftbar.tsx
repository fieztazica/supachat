import Link from "next/link";

export default function Sidebar() {
  return (
    <nav>
      <input placeholder="Search..." />
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  );
}
