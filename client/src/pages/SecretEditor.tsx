import { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Octokit } from "@octokit/rest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, Github, Lock, Trash2, Edit, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// GitHub Configuration
const REPO_OWNER = "Saudujin"; // Corrected username
const REPO_NAME = "mis-club";
const FILE_PATH = "client/public/posts.json";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
}

export default function SecretEditor() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [githubToken, setGithubToken] = useState("");
  
  // Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  
  // Data State
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load token from local storage
  useEffect(() => {
    const savedToken = localStorage.getItem("github_token");
    if (savedToken) setGithubToken(savedToken);
  }, []);

  // Fetch posts when authenticated and token is available
  useEffect(() => {
    if (isAuthenticated && githubToken) {
      fetchPosts();
    }
  }, [isAuthenticated, githubToken]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "mis2025") {
      setIsAuthenticated(true);
      toast.success("تم الدخول بنجاح");
    } else {
      toast.error("كلمة المرور غير صحيحة");
    }
  };

  const handleSaveToken = () => {
    localStorage.setItem("github_token", githubToken);
    toast.success("تم حفظ مفتاح GitHub");
    if (isAuthenticated) fetchPosts();
  };

  const fetchPosts = async () => {
    if (!githubToken) return;
    
    setIsLoading(true);
    const octokit = new Octokit({ auth: githubToken });

    try {
      const { data: fileData } = await octokit.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: FILE_PATH,
      });

      if (!Array.isArray(fileData) && fileData.type === "file") {
        const contentEncoded = fileData.content;
        const contentDecoded = atob(contentEncoded);
        // Handle UTF-8 characters correctly
        const jsonString = decodeURIComponent(escape(contentDecoded));
        const parsedPosts = JSON.parse(jsonString);
        setPosts(parsedPosts);
      }
    } catch (error) {
      console.error(error);
      toast.error("فشل في جلب المقالات. تأكد من صحة Token.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (post: Post) => {
    setIsEditing(true);
    setCurrentPostId(post.id);
    setTitle(post.title);
    setExcerpt(post.excerpt);
    setImage(post.image);
    setContent(post.content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNew = () => {
    setIsEditing(false);
    setCurrentPostId(null);
    setTitle("");
    setExcerpt("");
    setImage("");
    setContent("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (postId: string) => {
    if (!githubToken) return;

    setIsSaving(true);
    const octokit = new Octokit({ auth: githubToken });

    try {
      // 1. Get current file content
      const { data: currentFile } = await octokit.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: FILE_PATH,
      });

      if (!Array.isArray(currentFile) && currentFile.type === "file") {
        // 2. Filter out the deleted post
        const updatedPosts = posts.filter(p => p.id !== postId);

        // 3. Update file on GitHub
        // Use unescape(encodeURIComponent(...)) to handle UTF-8 characters
        const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(updatedPosts, null, 2))));

        await octokit.repos.createOrUpdateFileContents({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: FILE_PATH,
          message: `Delete post: ${postId}`,
          content: contentBase64,
          sha: currentFile.sha,
        });

        toast.success("تم حذف المقال بنجاح!");
        setPosts(updatedPosts);
        if (currentPostId === postId) handleNew();
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء الحذف.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!githubToken) {
      toast.error("يرجى إدخال مفتاح GitHub Token أولاً");
      return;
    }

    if (!title || !content) {
      toast.error("العنوان والمحتوى مطلوبان");
      return;
    }

    setIsSaving(true);
    const octokit = new Octokit({ auth: githubToken });

    try {
      // 1. Get current file content
      const { data: currentFile } = await octokit.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: FILE_PATH,
      });

      if (!Array.isArray(currentFile) && currentFile.type === "file") {
        // 2. Prepare post data
        const postData = {
          id: isEditing && currentPostId ? currentPostId : title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
          title,
          excerpt,
          content,
          image: image || "https://mis-club.vercel.app/og-image.png",
          date: isEditing ? posts.find(p => p.id === currentPostId)?.date || new Date().toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          author: "إدارة النادي"
        };

        let updatedPosts;
        if (isEditing) {
          updatedPosts = posts.map(p => p.id === currentPostId ? postData : p);
        } else {
          updatedPosts = [postData, ...posts];
        }

        // 3. Update file on GitHub
        const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(updatedPosts, null, 2))));

        await octokit.repos.createOrUpdateFileContents({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: FILE_PATH,
          message: isEditing ? `Update post: ${title}` : `Add new post: ${title}`,
          content: contentBase64,
          sha: currentFile.sha,
        });

        toast.success(isEditing ? "تم تحديث المقال بنجاح!" : "تم نشر المقال بنجاح!");
        setPosts(updatedPosts);
        if (!isEditing) handleNew();
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء النشر. تأكد من صحة Token واسم المستودع.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              تسجيل الدخول للمحرر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label>كلمة المرور</Label>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور السرية"
                />
              </div>
              <Button type="submit" className="w-full">دخول</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 container max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-white">لوحة تحكم المدونة</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <Input 
            type="password" 
            placeholder="GitHub Token" 
            value={githubToken}
            onChange={(e) => setGithubToken(e.target.value)}
            className="w-full md:w-64"
          />
          <Button variant="outline" onClick={handleSaveToken}>
            <Github className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{isEditing ? "تعديل مقال" : "مقال جديد"}</CardTitle>
              {isEditing && (
                <Button variant="ghost" size="sm" onClick={handleNew}>
                  <Plus className="w-4 h-4 ml-2" />
                  مقال جديد
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label>عنوان المقال</Label>
                <Input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="اكتب عنواناً جذاباً..."
                  className="text-lg font-bold"
                />
              </div>

              <div className="space-y-2">
                <Label>مقتطف قصير</Label>
                <Input 
                  value={excerpt} 
                  onChange={(e) => setExcerpt(e.target.value)} 
                  placeholder="وصف مختصر للمقال..."
                />
              </div>

              <div className="space-y-2">
                <Label>رابط الصورة</Label>
                <Input 
                  value={image} 
                  onChange={(e) => setImage(e.target.value)} 
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2" data-color-mode="light">
                <Label>المحتوى</Label>
                <div className="rounded-md overflow-hidden min-h-[300px] rtl-editor">
                  <style>{`
                    .rtl-editor .w-md-editor {
                      background-color: white !important;
                      color: black !important;
                    }
                    .rtl-editor .w-md-editor-text-pre, 
                    .rtl-editor .w-md-editor-text-input,
                    .rtl-editor textarea {
                      direction: rtl !important;
                      text-align: right !important;
                      font-family: 'IBM Plex Sans Arabic', sans-serif !important;
                      font-size: 16px !important;
                      line-height: 1.8 !important;
                    }
                    /* Ensure preview matches editor exactly */
                    .rtl-editor .wmde-markdown {
                      font-family: 'IBM Plex Sans Arabic', sans-serif !important;
                      font-size: 16px !important;
                      line-height: 1.8 !important;
                      direction: rtl !important;
                      text-align: right !important;
                    }
                    .rtl-editor .w-md-editor-toolbar li > button {
                      color: #333 !important;
                    }
                  `}</style>
                  <MDEditor
                    value={content}
                    onChange={(val) => setContent(val || "")}
                    height={400}
                    preview="edit"
                    textareaProps={{
                      dir: "rtl",
                      placeholder: "اكتب محتوى المقال هنا..."
                    }}
                  />
                </div>
              </div>

              <Button 
                onClick={handlePublish} 
                disabled={isSaving} 
                className="w-full text-lg py-6"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 ml-2" />
                    {isEditing ? "تحديث المقال" : "نشر المقال"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Posts List Section */}
        <div className="lg:col-span-1">
          <Card className="bg-card/50 backdrop-blur-sm border-white/10 h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>المقالات المنشورة</CardTitle>
              <Button variant="ghost" size="icon" onClick={fetchPosts} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[800px] overflow-y-auto">
              {posts.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  {isLoading ? "جاري التحميل..." : "لا توجد مقالات منشورة"}
                </div>
              ) : (
                posts.map((post) => (
                  <div 
                    key={post.id} 
                    className={`p-4 rounded-lg border transition-colors ${
                      currentPostId === post.id 
                        ? "bg-primary/10 border-primary" 
                        : "bg-background/50 border-white/5 hover:border-white/20"
                    }`}
                  >
                    <h3 className="font-bold mb-2 line-clamp-1">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(post)}
                      >
                        <Edit className="w-3 h-3 ml-1" />
                        تعديل
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-3 h-3 ml-1" />
                            حذف
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                            <AlertDialogDescription>
                              سيتم حذف مقال "{post.title}" نهائياً. لا يمكن التراجع عن هذا الإجراء.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(post.id)}>
                              نعم، احذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
