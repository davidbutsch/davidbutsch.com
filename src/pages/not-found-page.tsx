import { Link } from "react-router"

export function NotFoundPage() {
  return (
    <div>
      <h2 className="font-serif text-lg font-bold">Not found</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        That page doesn&apos;t exist.
      </p>
      <Link
        to="/"
        className="mt-4 inline-block text-sm underline-offset-4 hover:underline"
      >
        &larr; Back home
      </Link>
    </div>
  )
}
