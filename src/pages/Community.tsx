import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, ThumbsUp, Share2, User, Search, Filter, PlusCircle, Bookmark, X } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import GlassCard from "@/components/dashboard/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

type Post = {
    id: number;
    author: string;
    role: string;
    content: string;
    likes: number;
    comments: number;
    category: string;
    time: string;
    bookmarked: boolean;
    liked: boolean;
    created_at?: string;
};

const ALL_CATEGORIES = ["All", "Interview Experience", "Doubt", "AI Tip"];

const Community = () => {
    const { toast } = useToast();
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [showFilter, setShowFilter] = useState(false);
    const [showNewPost, setShowNewPost] = useState(false);
    const [newContent, setNewContent] = useState("");

    // Fetch initial posts and subscribe to new ones
    useEffect(() => {
        fetchPosts();

        const channel = supabase
            .channel('public:community_posts')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_posts' }, (payload) => {
                const newPost = payload.new as Post;
                setPosts((prev) => [newPost, ...prev]);
            })
             .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'community_posts' }, (payload) => {
                const updatedPost = payload.new as Post;
                setPosts((prev) => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchPosts = async () => {
        const { data, error } = await supabase
            .from('community_posts')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching posts:', error);
            // Fallback to empty array if table doesn't exist yet
            setPosts([]);
        } else if (data) {
            setPosts(data);
        }
    };

    const filtered = posts.filter(p => {
        const matchesSearch = p.content.toLowerCase().includes(search.toLowerCase()) ||
            p.author.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === "All" || p.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const handleLike = async (id: number) => {
        const post = posts.find(p => p.id === id);
        if (!post) return;
        
        const newLiked = !post.liked;
        const newLikes = newLiked ? post.likes + 1 : Math.max(0, post.likes - 1);

        // Optimistic update
        setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: newLiked, likes: newLikes } : p));

        // Update database (simplified like toggle for demo)
        await supabase.from('community_posts').update({ likes: newLikes }).eq('id', id);
    };

    const handleBookmark = (id: number) => {
        setPosts(prev => prev.map(p => p.id === id
            ? { ...p, bookmarked: !p.bookmarked }
            : p
        ));
        const post = posts.find(p => p.id === id);
        toast({ title: post?.bookmarked ? "Removed from bookmarks" : "Bookmarked!", description: "You can find saved posts in your profile." });
    };

    const handleShare = (post: Post) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(`"${post.content}" — ${post.author}, PlacePrep Community`);
            toast({ title: "Copied to clipboard!", description: "Share this post with your friends." });
        } else {
            toast({ title: "Share", description: `"${post.content}" — ${post.author}` });
        }
    };

    const handleComment = (post: Post) => {
        toast({ title: `Viewing ${post.comments} comments`, description: "Comment thread will open soon." });
    };

    const handleNewPost = async () => {
        if (!newContent.trim()) return;
        
        const authorName = user?.name || user?.email?.split('@')[0] || "Student";
        
        const newPostData = {
            author: authorName,
            role: "Student",
            content: newContent,
            likes: 0,
            comments: 0,
            category: "Doubt",
            time: "Just now",
            bookmarked: false,
            liked: false
        };

        // If table doesn't exist, this will fail gracefully and we do optimistic local update for demo purposes
        const { data, error } = await supabase.from('community_posts').insert([newPostData]).select();
        
        if (error) {
             console.error('Insert error:', error);
             // Optimistic fallback if DB isn't ready
             const fallbackPost: Post = { ...newPostData, id: Date.now() };
             setPosts(prev => [fallbackPost, ...prev]);
             toast({ title: "Post published locally", description: "Database table not ready, showing locally for now." });
        } else {
             toast({ title: "Post published!", description: "Your discussion is now live." });
             // We rely on real-time subscription to update the list if insert succeeds
             // Or explicitly add if no realtime
             if (!supabase.getChannels().some(c => c.topic === 'realtime:public:community_posts')) {
                fetchPosts();
             }
        }
        
        setNewContent("");
        setShowNewPost(false);
    };

    return (
        <div className="min-h-screen">
            <DashboardNavbar title="Peer Learning Community" />
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header Actions */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search experiences, tips, or doubts..."
                                className="pl-10 rounded-2xl bg-muted/20 border-border/50"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className={`rounded-xl border-border/50 px-4 ${showFilter ? "bg-primary/10 border-primary/30" : ""}`}
                                onClick={() => setShowFilter(v => !v)}
                            >
                                <Filter className="w-4 h-4 mr-2" /> Filter
                            </Button>
                            <Button
                                className="rounded-xl bg-primary text-primary-foreground btn-glow px-4"
                                onClick={() => setShowNewPost(true)}
                            >
                                <PlusCircle className="w-4 h-4 mr-2" /> Start Discussion
                            </Button>
                        </div>
                    </div>

                    {/* Filter Pills */}
                    {showFilter && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 mb-6">
                            {ALL_CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </motion.div>
                    )}

                    {/* New Post Form */}
                    {showNewPost && (
                        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                            <GlassCard className="border-primary/20">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-foreground">Start a New Discussion</h4>
                                    <button onClick={() => setShowNewPost(false)} className="text-muted-foreground hover:text-foreground">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <textarea
                                    value={newContent}
                                    onChange={e => setNewContent(e.target.value)}
                                    placeholder="Share your experience, ask a doubt, or post a tip..."
                                    className="w-full min-h-[100px] p-4 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/50 transition-all outline-none text-sm resize-none"
                                />
                                <div className="flex justify-end gap-2 mt-3">
                                    <Button variant="outline" className="rounded-xl" onClick={() => setShowNewPost(false)}>Cancel</Button>
                                    <Button className="rounded-xl bg-primary text-primary-foreground" onClick={handleNewPost}>Post</Button>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    <div className="space-y-6">
                        {filtered.length === 0 && (
                            <p className="text-center text-muted-foreground py-12">No posts match your search. Make sure the database table exists and has data!</p>
                        )}
                        {filtered.map((post, i) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                            >
                                <GlassCard className="group hover:border-primary/20 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center border border-primary/5">
                                                <User className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-foreground">{post.author}</h4>
                                                <p className="text-xs text-muted-foreground">{post.role} • {post.time}</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 rounded-full bg-muted/30 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border border-border/50">
                                            {post.category}
                                        </span>
                                    </div>

                                    <p className="text-sm text-foreground leading-relaxed mb-6">{post.content}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-border/30">
                                        <div className="flex gap-6">
                                            <button
                                                onClick={() => handleLike(post.id)}
                                                className={`flex items-center gap-1.5 text-xs transition-colors ${post.liked ? "text-primary font-bold" : "text-muted-foreground hover:text-primary"}`}
                                            >
                                                <ThumbsUp className="w-4 h-4" /> {post.likes}
                                            </button>
                                            <button
                                                onClick={() => handleComment(post)}
                                                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-secondary transition-colors"
                                            >
                                                <MessageSquare className="w-4 h-4" /> {post.comments}
                                            </button>
                                            <button
                                                onClick={() => handleShare(post)}
                                                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors"
                                            >
                                                <Share2 className="w-4 h-4" /> Share
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleBookmark(post.id)}
                                            className={`transition-colors ${post.bookmarked ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                                        >
                                            <Bookmark className={`w-4 h-4 ${post.bookmarked ? "fill-current" : ""}`} />
                                        </button>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community;

