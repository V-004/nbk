import Link from "next/link"
import { Logo } from "@/components/logo"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="flex flex-col gap-2">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Enabling secure and seamless banking integrations.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-3 lg:col-span-4 lg:grid-cols-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Documentation</h3>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/docs/introduction" className="transition-colors hover:text-foreground">
                    Introduction
                  </Link>
                </li>
                <li>
                  <Link href="/docs/quick-start" className="transition-colors hover:text-foreground">
                    Quick Start
                  </Link>
                </li>
                <li>
                  <Link href="/docs/authentication" className="transition-colors hover:text-foreground">
                    Authentication
                  </Link>
                </li>
                <li>
                  <Link href="/docs/guides" className="transition-colors hover:text-foreground">
                    Guides
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">APIs</h3>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/docs/api/accounts" className="transition-colors hover:text-foreground">
                    Accounts
                  </Link>
                </li>
                <li>
                  <Link href="/docs/api/payments" className="transition-colors hover:text-foreground">
                    Payments
                  </Link>
                </li>
                <li>
                  <Link href="/docs/api/transactions" className="transition-colors hover:text-foreground">
                    Transactions
                  </Link>
                </li>
                <li>
                  <Link href="/docs/api/analytics" className="transition-colors hover:text-foreground">
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Resources</h3>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/sdks" className="transition-colors hover:text-foreground">
                    SDKs
                  </Link>
                </li>
                <li>
                  <Link href="/sandbox" className="transition-colors hover:text-foreground">
                    Sandbox
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="transition-colors hover:text-foreground">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/changelog" className="transition-colors hover:text-foreground">
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Legal</h3>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="transition-colors hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="transition-colors hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="transition-colors hover:text-foreground">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="/compliance" className="transition-colors hover:text-foreground">
                    Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} NexusBank. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="https://twitter.com/nexusbank" className="text-muted-foreground hover:text-foreground">
              Twitter
            </Link>
            <Link href="https://github.com/nexusbank" className="text-muted-foreground hover:text-foreground">
              GitHub
            </Link>
            <Link href="https://linkedin.com/company/nexusbank" className="text-muted-foreground hover:text-foreground">
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
