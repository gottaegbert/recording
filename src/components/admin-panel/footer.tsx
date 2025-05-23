import Link from 'next/link';

export function Footer() {
  return (
    <div className="z-20 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-4 flex h-14 items-center md:mx-8">
        <p className="text-left text-xs leading-loose text-muted-foreground md:text-sm">
          {/* Check{' '} */}
          Just record my process during design and development.{' '}
          <Link
            href="https://egbert.eu.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Check my design project
          </Link>
          {/* . The source code is available on{' '}
          <Link
            href="https://github.com/gottaegbert/recording"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </Link>
          . */}
        </p>
      </div>
    </div>
  );
}
