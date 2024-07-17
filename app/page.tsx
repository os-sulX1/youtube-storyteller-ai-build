import StoryWriter from "@/components/StoryWriter";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
   <main className="flex-1 flex flex-col" >
    <section className="flex-1 grid grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col space-y-5 justify-center items-center bg-green-100 order-1 lg:-order-1 pb-10">
        <Image alt="logo" width={250} height={250} src={'/hat.jpg'} />

        <Button asChild className="px-20 bg-lime-300 text-black p-10 text-xl">
          <Link href={'/stories'} >Explore Story Library</Link>
        </Button>
      </div>
      <StoryWriter />
    </section>
   </main>
  );
}
