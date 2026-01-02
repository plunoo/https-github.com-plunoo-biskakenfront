
import React, { useState, useRef } from 'react';
import { Card, Button, Input, Badge } from '../components/UI';
import { useStore } from '../store/useStore';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Upload, 
  Send, 
  Trash2, 
  BookOpen, 
  Loader2,
  RefreshCcw,
  Check
} from 'lucide-react';
import { generateBlogText, generateBlogImage } from '../services/gemini';
import { BlogPost } from '../types';

const BlogManagementPage: React.FC = () => {
  const { blogPosts, addBlogPost, deleteBlogPost } = useStore();
  const [topic, setTopic] = useState('');
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateText = async () => {
    if (!topic) return;
    setIsGeneratingText(true);
    try {
      const result = await generateBlogText(topic);
      setCurrentPost({
        ...result,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      });
    } catch (error) {
      alert("Failed to generate content. Please try again.");
    } finally {
      setIsGeneratingText(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!currentPost?.imagePrompt) return;
    setIsGeneratingImage(true);
    try {
      const imageUrl = await generateBlogImage(currentPost.imagePrompt);
      setCurrentPost(prev => prev ? { ...prev, image: imageUrl } : null);
    } catch (error) {
      alert("Failed to generate image.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentPost(prev => prev ? { ...prev, image: reader.result as string } : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    if (!currentPost?.title || !currentPost?.content || !currentPost?.image) {
      alert("Please ensure title, content, and image are ready.");
      return;
    }
    const newPost: BlogPost = {
      id: Math.random().toString(36).substr(2, 9),
      title: currentPost.title!,
      content: currentPost.content!,
      image: currentPost.image!,
      category: currentPost.category || 'General',
      date: currentPost.date!,
      readTime: currentPost.readTime || '3 min read',
      imagePrompt: currentPost.imagePrompt
    };
    addBlogPost(newPost);
    setCurrentPost(null);
    setTopic('');
    alert("Post published successfully!");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Blog Manager</h1>
        <p className="text-gray-500">Generate professional content for your shop's landing page.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Editor Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Generator Settings">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Post Topic / Caption</label>
                <textarea 
                  className="w-full p-3 border rounded-lg h-24 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Benefits of regular oil changes during the rainy season in Accra..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                <Button 
                  className="w-full" 
                  onClick={handleGenerateText} 
                  loading={isGeneratingText}
                  icon={Sparkles}
                >
                  Generate Content
                </Button>
              </div>

              {currentPost && (
                <div className="pt-4 border-t space-y-4 animate-in fade-in duration-300">
                  <p className="text-sm font-semibold">Visual Representation</p>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      className="flex-1 border border-gray-200" 
                      icon={Upload}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload
                    </Button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileUpload}
                    />
                    <Button 
                      variant="secondary" 
                      className="flex-1" 
                      icon={RefreshCcw}
                      loading={isGeneratingImage}
                      onClick={handleGenerateImage}
                    >
                      AI Generate
                    </Button>
                  </div>
                  {currentPost.imagePrompt && (
                    <p className="text-[10px] text-gray-400 italic">Prompt: {currentPost.imagePrompt}</p>
                  )}
                </div>
              )}
            </div>
          </Card>

          {currentPost && (
            <Button size="lg" className="w-full h-14 text-lg" icon={Send} onClick={handlePublish}>
              Publish Post
            </Button>
          )}
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-3">
          {currentPost ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden animate-in zoom-in-95 duration-500">
              <div className="aspect-[21/9] bg-gray-100 relative group">
                {currentPost.image ? (
                  <img src={currentPost.image} className="w-full h-full object-cover" alt="Post preview" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2">
                    <ImageIcon size={48} />
                    <span>No image selected</span>
                  </div>
                )}
                {isGeneratingImage && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white">
                    <div className="text-center">
                      <Loader2 className="animate-spin mx-auto mb-2" size={32} />
                      <p className="text-sm font-bold">Dreaming up your image...</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <Badge variant="success">{currentPost.category || 'Category'}</Badge>
                  <span className="text-sm text-gray-400">{currentPost.readTime || '3 min read'}</span>
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
                  {currentPost.title || 'Post Title will appear here'}
                </h2>
                <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {currentPost.content || 'Start generating to see your story take shape...'}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 gap-4">
              <BookOpen size={64} strokeWidth={1} />
              <div className="text-center">
                <p className="text-lg font-medium">Post Preview</p>
                <p className="text-sm">Input a topic to begin creating with AI.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Published Posts List */}
      <div className="pt-8 border-t">
        <h3 className="text-xl font-bold mb-6">Published Posts</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map(post => (
            <Card key={post.id} className="group overflow-hidden">
              <div className="aspect-video relative overflow-hidden -mx-6 -mt-6 mb-4">
                <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <button 
                  className="absolute top-3 right-3 p-2 bg-white/90 text-red-600 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteBlogPost(post.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h4>
              <p className="text-xs text-gray-500">{post.date}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogManagementPage;
