import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Loader2,
  Copy,
  Check
} from "lucide-react";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onImagesChange, maxImages = 10 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/upload/single', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const result = await response.json();
        return result.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedUrls].slice(0, maxImages);
      onImagesChange(newImages);
      
      // Clear the input
      event.target.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload one or more images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlAdd = () => {
    if (images.length < maxImages) {
      onImagesChange([...images, ""]);
    }
  };

  const updateImageUrl = (index: number, url: string) => {
    const newImages = [...images];
    newImages[index] = url;
    onImagesChange(newImages);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Product Images</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUrlAdd}
            disabled={images.length >= maxImages}
          >
            Add URL
          </Button>
          <div className="relative">
            <Button
              type="button"
              size="sm"
              disabled={uploading || images.length >= maxImages}
              className="bg-industrial-blue hover:bg-blue-600"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                </>
              )}
            </Button>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              disabled={uploading || images.length >= maxImages}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {images.map((image, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex gap-4 items-start">
                {/* Image Preview */}
                <div className="flex-shrink-0">
                  {image ? (
                    <div className="relative group">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden w-20 h-20 bg-gray-100 rounded-lg border flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-lg border flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* URL Input */}
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={image}
                      onChange={(e) => updateImageUrl(index, e.target.value)}
                      placeholder="Image URL or upload a file"
                      className="flex-1"
                    />
                    {image && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(image)}
                      >
                        {copied === image ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {image && !image.startsWith('http') && !image.startsWith('/') && (
                    <p className="text-xs text-yellow-600">
                      ⚠️ URL should start with http:// or https://
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {images.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-8 text-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No images added</h3>
            <p className="text-gray-500 mb-4">Upload images or add URLs to showcase your product</p>
            <div className="flex gap-2 justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleUrlAdd}
              >
                Add URL
              </Button>
              <div className="relative">
                <Button
                  type="button"
                  disabled={uploading}
                  className="bg-industrial-blue hover:bg-blue-600"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Images
                    </>
                  )}
                </Button>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-gray-500">
        <p>• Supports JPEG, PNG, GIF, WebP formats</p>
        <p>• Maximum file size: 5MB per image</p>
        <p>• Maximum {maxImages} images per product</p>
      </div>
    </div>
  );
}
