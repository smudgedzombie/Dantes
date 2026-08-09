export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-[var(--frost)]">
      <div className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <span className="font-mono text-sm font-bold">S</span>
              </span>
              <span className="text-sm font-semibold tracking-tight">Stash Pro Global</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Precision storage and carry gear. Sealed, machined, and shipped
              worldwide.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {[
              [
                'Shop',
                [
                  ['Lighters', '#lighters'],
                  ['Grinders', '#grinders'],
                  ['Rolling Papers', '#rolling-papers'],
                  ['Storage Jars', '#storage-jars'],
                ],
              ],
              [
                'More',
                [
                  ['Ashtrays', '#ashtrays'],
                  ['Rolling Trays', '#rolling-trays'],
                  ['Pre-Rolled Cones', '#pre-rolled-cones'],
                  ['Sheesha & Hookah', '#sheesha'],
                ],
              ],
              [
                'Company',
                [
                  ['About', '#gallery'],
                  ['Wholesale', '#gallery'],
                  ['Shipping', '#gallery'],
                  ['Contact', '#gallery'],
                ],
              ],
            ].map(([title, links]) => (
              <div key={title as string}>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {title as string}
                </h4>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {(links as [string, string][]).map(([link, href]) => (
                    <li key={link}>
                      <a
                        href={href}
                        className="text-sm text-foreground/80 transition-colors hover:text-primary"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            &copy; {new Date().getFullYear()} Stash Pro Global
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            Sealed &middot; Machined &middot; Worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}
