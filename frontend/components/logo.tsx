import Link from "next/link"
import Image from "next/image"

interface LogoProps {
  asLink?: boolean
}

export function Logo({ asLink = true }: LogoProps) {
  const logoContent = (
    <>
      <div className="flex h-8 w-8 items-center justify-center rounded-md overflow-hidden">
        <Image
          src="/nexus-logo.png"
          alt="Nexus Bank Logo"
          width={32}
          height={32}
          className="object-contain"
        />
      </div>
      <span className="font-bold">NexusBank</span>
    </>
  )

  if (asLink) {
    return (
      <Link href="/" className="flex items-center gap-2">
        {logoContent}
      </Link>
    )
  }

  return <div className="flex items-center gap-2">{logoContent}</div>
}
