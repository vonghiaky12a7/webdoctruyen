"use client";

import Breadcrumb from "@/components/Breadcrumbs";
import DetailStory from "@/components/ui/detail-story/DetailStory";



export default function Page() {
  return (
    <section>
      <div className="bg-muted/50">
        <div className="container mx-auto py-2 px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Truyện" }]} />
        </div>
      </div>
      <DetailStory />
    </section>
  );
}
