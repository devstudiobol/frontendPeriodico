import { useState } from "react";
import { Header } from "@/components/Header";
import { CategoryChips } from "@/components/CategoryChips";
import { NewsFeed } from "@/components/NewsFeed";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <CategoryChips
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <main className="flex-1">
        <NewsFeed selectedCategory={selectedCategory} searchQuery={searchQuery} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
