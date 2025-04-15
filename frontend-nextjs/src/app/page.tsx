"use client";
import TruyenList from "@/components/StoryList";
import Banner from "@/components/Banner";
import Slider from "@/components/Slider";
export default function Home() {
  return (
    <section>
      <Banner />
      <Slider />
      <TruyenList />
    </section>
  );
}
