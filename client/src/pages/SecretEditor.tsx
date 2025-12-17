import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Octokit } from "@octokit/rest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, Github, Lock } from "lucide-react";
import { toast } from "sonner";

// GitHub Configuration
const REPO_OWNER = "saudujins"; // Replace with your GitHub username
const REPO_NAME = "mis-club";   // Replace with your repo name
const FILE_PATH = "client/public/posts.json";

export default function SecretEditor() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [githubToken, setGithubToken] = useState("");
  
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load token from local storage
  useEffect(() => {
    const savedToken = localStorage.getItem("github_token");
    if (savedToken) setGithubToken(savedToken);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side password (not secure, but enough for obscurity as requested)
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
      // 1. Get current file content (to get SHA)
      const { data: currentFile } = await octokit.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: FILE_PATH,
      });

      if (!Array.isArray(currentFile) && currentFile.type === "file") {
        const contentEncoded = currentFile.content;
        const contentDecoded = atob(contentEncoded);
        const posts = JSON.parse(contentDecoded);

        // 2. Add new post
        const newPost = {
          id: title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
          title,
          excerpt,
          content,
          image: image || "https://mis-club.vercel.app/og-image.png",
          date: new Date().toISOString().split("T")[0],
          author: "إدارة النادي"
        };

        const updatedPosts = [newPost, ...posts];

        // 3. Update file on GitHub
        await octokit.repos.createOrUpdateFileContents({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: FILE_PATH,
          message: `Add new post: ${title}`,
          content: btoa(unescape(encodeURIComponent(JSON.stringify(updatedPosts, null, 2)))),
          sha: currentFile.sha,
        });

        toast.success("تم نشر المقال بنجاح! سيظهر في الموقع خلال دقائق.");
        setTitle("");
        setExcerpt("");
        setContent("");
        setImage("");
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
    <div className="min-h-screen pt-24 pb-12 container max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">محرر المدونة</h1>
        <div className="flex gap-2">
          <Input 
            type="password" 
            placeholder="GitHub Token" 
            value={githubToken}
            onChange={(e) => setGithubToken(e.target.value)}
            className="w-48"
          />
          <Button variant="outline" onClick={handleSaveToken}>
            <Github className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-white/10">
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
            <Label>مقتطف قصير (يظهر في البطاقة)</Label>
            <Input 
              value={excerpt} 
              onChange={(e) => setExcerpt(e.target.value)} 
              placeholder="وصف مختصر للمقال..."
            />
          </div>

          <div className="space-y-2">
            <Label>رابط الصورة (اختياري)</Label>
            <Input 
              value={image} 
              onChange={(e) => setImage(e.target.value)} 
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label>المحتوى</Label>
            <div className="bg-white text-black rounded-md overflow-hidden min-h-[300px]">
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent}
                className="h-[250px]"
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                    ['link', 'image'],
                    ['clean']
                  ],
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
                جاري النشر...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 ml-2" />
                نشر المقال
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
