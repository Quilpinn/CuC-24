"use client"
import TopBar from "@/components/topBar/topBar";
import Feed from "@/components/feed/feed";
import NewEventButton from "@/components/newEventButton";

export default function Home() {

  return (
    <div>
      <TopBar/>
      <Feed/>
      <NewEventButton/>
    </div>
  );
}
