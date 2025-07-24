import FullLogo from "@/components/FullLogo";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <p>This is the home page</p>
      <FullLogo />
      <div>
         Login <Link href="/sign-in">Sign In</Link>
      </div>
    </div>
  )

}
