import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <h1 className="text-center text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Personalized Gifts
          <br className="hidden sm:inline" />
          That Define You.
        </h1>
        <p className="mx-auto max-w-[700px] text-center text-lg text-muted-foreground sm:text-xl">
          Welcome to <span className="font-semibold">UM Entreprise</span>. 
          Discover our exclusive collection of custom wallets, pens, keychains, and more. 
          Crafted just for you.
        </p>

        <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-10">
          <Button asChild size="lg">
            <Link href="/products">Shop Now</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/customize">Create Your Own</Link>
          </Button>
        </div>
      </div>

      {/* You can add "Featured Products" section here later */}
    </section>
  );
}