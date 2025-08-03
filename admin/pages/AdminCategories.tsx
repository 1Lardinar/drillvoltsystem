import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  FolderOpen,
  Search,
  Plus,
  Edit,
  Trash2,
  Package,
  ToggleLeft,
  ToggleRight,
  Image as ImageIcon
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
  isActive: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoryFormData {
  name: string;
  description: string;
  image?: string;
  isActive: boolean;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch("/api/categories", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryStats = () => {
    const totalCategories = categories.length;
    const activeCategories = categories.filter(c => c.isActive).length;
    const totalProducts = categories.reduce((sum, cat) => sum + cat.productCount, 0);
    const categoriesWithProducts = categories.filter(c => c.productCount > 0).length;

    return { totalCategories, activeCategories, totalProducts, categoriesWithProducts };
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = getCategoryStats();

  function CreateCategoryDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CategoryFormData>({
      name: "",
      description: "",
      image: "",
      isActive: true
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
          toast({
            title: "Success",
            description: "Category created successfully"
          });
          setOpen(false);
          setFormData({ name: "", description: "", image: "", isActive: true });
          fetchCategories();
        } else {
          toast({
            title: "Error",
            description: data.error || "Failed to create category",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create category",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-industrial-blue hover:bg-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="image">Image URL (Optional)</Label>
              <Input
                id="image"
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  function EditCategoryDialog({ category }: { category: Category }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CategoryFormData>({
      name: category.name,
      description: category.description,
      image: category.image || "",
      isActive: category.isActive
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`/api/categories/${category.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
          toast({
            title: "Success",
            description: "Category updated successfully"
          });
          setOpen(false);
          fetchCategories();
        } else {
          toast({
            title: "Error",
            description: data.error || "Failed to update category",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update category",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="image">Image URL (Optional)</Label>
              <Input
                id="image"
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  function DeleteCategoryDialog({ category }: { category: Category }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`/api/categories/${category.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success) {
          toast({
            title: "Success",
            description: "Category deleted successfully"
          });
          fetchCategories();
        } else {
          toast({
            title: "Error",
            description: data.error || "Failed to delete category",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete category",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-600 hover:text-red-700"
            disabled={category.productCount > 0}
            title={category.productCount > 0 ? "Cannot delete category with products" : "Delete category"}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{category.name}"? This action cannot be undone.
              {category.productCount > 0 && (
                <div className="mt-2 p-2 bg-red-50 text-red-800 rounded">
                  This category has {category.productCount} products. Please move them to another category first.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={loading || category.productCount > 0}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <FolderOpen className="h-16 w-16 text-industrial-blue mx-auto mb-4 animate-pulse" />
          <div className="text-xl text-industrial-gray">Loading categories...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-industrial-dark">Category Management</h1>
        <CreateCategoryDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-industrial-gray">Total Categories</p>
                <p className="text-2xl font-bold text-industrial-dark">{stats.totalCategories}</p>
              </div>
              <div className="bg-industrial-blue/10 p-3 rounded-full">
                <FolderOpen className="h-6 w-6 text-industrial-blue" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-industrial-gray">Active Categories</p>
                <p className="text-2xl font-bold text-industrial-dark">{stats.activeCategories}</p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-full">
                <ToggleRight className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-industrial-gray">Total Products</p>
                <p className="text-2xl font-bold text-industrial-dark">{stats.totalProducts}</p>
              </div>
              <div className="bg-industrial-orange/10 p-3 rounded-full">
                <Package className="h-6 w-6 text-industrial-orange" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-industrial-gray">With Products</p>
                <p className="text-2xl font-bold text-industrial-dark">{stats.categoriesWithProducts}</p>
              </div>
              <div className="bg-purple-500/10 p-3 rounded-full">
                <Package className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-8 border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Category Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-industrial-dark mb-2">
              {searchTerm ? 'No categories found' : 'No categories yet'}
            </h3>
            <p className="text-industrial-gray mb-6">
              {searchTerm 
                ? `No categories match "${searchTerm}". Try a different search term.`
                : 'Categories will help organize your products for better navigation.'
              }
            </p>
            {!searchTerm && <CreateCategoryDialog />}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {category.image ? (
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-industrial-blue/10 rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-industrial-blue" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-industrial-dark">{category.name}</h3>
                      <Badge className={category.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                        {category.isActive ? (
                          <>
                            <ToggleRight className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="h-3 w-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <EditCategoryDialog category={category} />
                    <DeleteCategoryDialog category={category} />
                  </div>
                </div>
                <p className="text-industrial-gray text-sm mb-4">{category.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-industrial-gray">
                    <Package className="h-4 w-4 mr-1" />
                    {category.productCount} products
                  </div>
                  <div className="text-industrial-gray">
                    Created {formatDate(category.createdAt)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
