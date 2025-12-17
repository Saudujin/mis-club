import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import MarkdownPreview from '@uiw/react-markdown-preview';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
}

export default function BlogPost() {
  const [, params] = useRoute("/blog/:id");
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/posts.json")
      .then((res) => res.json())
      .then((data: BlogPost[]) => {
        const foundPost = data.find((p) => p.id === params?.id);
        setPost(foundPost || null);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load post", err);
        setIsLoading(false);
      });
  }, [params?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">المقال غير موجود</h1>
        <Link href="/blog">
          <Button>العودة للمدونة</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 relative">
      <SEO 
        title={post.title}
        description={post.excerpt}
        image={post.image}
        url={`https://mis-club.vercel.app/blog/${post.id}`}
      />

      {/* Hero Image Background (Blurred) */}
      <div className="absolute top-0 left-0 w-full h-[60vh] overflow-hidden -z-10">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-20 blur-xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
      </div>

      <article className="container max-w-4xl mx-auto px-4">
        <Link href="/blog">
          <Button variant="ghost" className="mb-8 group pl-0 hover:pl-2 transition-all">
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            العودة للمدونة
          </Button>
        </Link>

        {/* Main Content Card */}
        <div className="bg-card/30 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* 16:9 Featured Image */}
          <div className="w-full aspect-video relative overflow-hidden bg-black/20">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8 md:p-12">
            <header className="mb-10 text-center">
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <Calendar className="w-3 h-3 ml-1" />
                  {post.date}
                </Badge>
                <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                  <User className="w-3 h-3 ml-1" />
                  {post.author}
                </Badge>
              </div>
              
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight"
              >
                {post.title}
              </motion.h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {post.excerpt}
              </p>
            </header>

            <div className="prose prose-invert prose-lg max-w-none prose-headings:text-primary prose-a:text-secondary hover:prose-a:text-secondary/80 prose-img:rounded-xl" data-color-mode="dark">
              <MarkdownPreview 
                source={post.content} 
                style={{ backgroundColor: 'transparent', color: 'inherit' }}
              />
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 flex justify-center">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post.title,
                      text: post.excerpt,
                      url: window.location.href,
                    });
                  }
                }}
              >
                <Share2 className="w-4 h-4 ml-2" />
                مشاركة المقال
              </Button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
