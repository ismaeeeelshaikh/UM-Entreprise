"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import ImageUpload from "@/components/ImageUpload";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ✅ Updated schema - removed .default() from isCustomizable
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  isCustomizable: z.boolean(),
  customizationLabel: z.string().optional(),
  hasVariants: z.boolean(),

  // Base fields (become optional if hasVariants is true)
  price: z.string().optional(),
  images: z.array(z.string()).optional(),
  stock: z.string().optional(),
  color: z.string().optional(),

  variants: z.array(z.object({
    color: z.string().min(1, "Color is required"),
    colorCode: z.string().optional(),
    price: z.string().optional(),
    stock: z.string().min(1, "Stock is required"),
    images: z.array(z.string()).min(1, "At least one image is required"),
  })).optional(),
}).superRefine((data, ctx) => {
  if (!data.hasVariants) {
    if (!data.price) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Price is required", path: ["price"] });
    if (!data.images || data.images.length === 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Images are required", path: ["images"] });
    if (!data.stock) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Stock is required", path: ["stock"] });
  } else {
    if (!data.variants || data.variants.length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "At least one variant is required", path: ["variants"] });
    }
  }
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData?: any;
  productId?: string;
}

export default function ProductForm({
  initialData,
  productId,
}: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const title = initialData ? "Edit Product" : "Create Product";
  const description = initialData
    ? "Edit product details"
    : "Add a new product";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
        ...initialData,
        price: initialData.price ? String(initialData.price) : "",
        stock: initialData.stock ? String(initialData.stock) : "",
        color: initialData.color || "",
        isCustomizable: initialData.isCustomizable ?? false,
        customizationLabel: initialData.customizationLabel ?? "",
        hasVariants: initialData.variants && initialData.variants.length > 0,
        variants: initialData.variants ? initialData.variants.map((v: any) => ({
          color: v.color,
          colorCode: v.colorCode || "",
          price: v.price ? String(v.price) : "",
          stock: String(v.stock),
          images: v.images
        })) : [],
      }
      : {
        name: "",
        description: "",
        price: "",
        images: [],
        category: "",
        color: "",
        stock: "",
        isCustomizable: false,
        customizationLabel: "",
        hasVariants: false,
        variants: [],
      },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const hasVariants = form.watch("hasVariants");

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsLoading(true);

      const url = productId
        ? `/api/admin/products/${productId}`
        : "/api/admin/products";

      const method = productId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      router.refresh();
      router.push("/admin/products");

      toast({
        title: "Success",
        description: `Product ${productId ? "updated" : "created"} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Images - Only show if NO variants (as variants have their own images) */}
            {!hasVariants && (
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value || []}
                        disabled={isLoading}
                        onChange={(urls) => field.onChange(urls)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!hasVariants && <Separator />}

            {/* Basic Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Wallet, Pen, etc."
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Variants Toggle */}
            <FormField
              control={form.control}
              name="hasVariants"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Does this product have variants?
                    </FormLabel>
                    <FormDescription>
                      Check this if the product comes in multiple colors or options.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {!hasVariants ? (
              // SIMPLE PRODUCT FIELDS
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input
                          className="font-bold"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              // VARIANTS LIST
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-lg font-bold">Product Variants</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => append({ color: "", stock: "", images: [], price: "" })}
                  >
                    <Plus className="h-4 w-4" /> Add Variant
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <Card key={field.id}>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Variant {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <FormField
                          control={form.control}
                          name={`variants.${index}.color`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Color Name</FormLabel>
                              <FormControl>
                                <Input disabled={isLoading} placeholder="Red" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`variants.${index}.price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price Override (Optional)</FormLabel>
                              <FormControl>
                                <Input disabled={isLoading} type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`variants.${index}.stock`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Stock</FormLabel>
                              <FormControl>
                                <Input disabled={isLoading} type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`variants.${index}.images`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Variant Images</FormLabel>
                            <FormControl>
                              <ImageUpload
                                value={field.value || []}
                                disabled={isLoading}
                                onChange={(urls) => field.onChange(urls)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                ))}

                {fields.length === 0 && (
                  <p className="text-sm text-center text-muted-foreground p-4 border border-dashed rounded-md">
                    No variants added. Click "Add Variant" to create one.
                  </p>
                )}
              </div>
            )}

            <Separator />

            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="isCustomizable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Allow Customization?
                      </FormLabel>
                      <FormDescription>
                        Check this if you want to allow customers to enter custom text (e.g. for engraving).
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {/* Customization Label - Only show if customizable is checked */}
              {form.watch("isCustomizable") && (
                <FormField
                  control={form.control}
                  name="customizationLabel"

                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customization Label (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        If provided, customers can add custom text to this product
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <Button disabled={isLoading} className="ml-auto" type="submit">
              {action}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
