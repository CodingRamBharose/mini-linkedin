"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

interface User {
  name?: string;
  bio?: string;
}

export function ProfileForm({
  user,
  onSuccess,
  onCancel
}: {
  user: User;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      bio: user.bio || "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: User) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Profile update failed');
      }

      await onSuccess();
    } catch (error) {
      console.error('Error updating profile:', error);
      // You might want to show a toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm sm:text-base">Full Name</FormLabel>
              <FormControl>
                <Input {...field} className="h-10 sm:h-11 text-sm sm:text-base" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm sm:text-base">Bio</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Tell us about your professional background..."
                  rows={3}
                  className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button type="submit" disabled={isSubmitting} className="h-10 sm:h-11 text-sm sm:text-base">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                Saving...
              </>
            ) : 'Save Changes'}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-10 sm:h-11 text-sm sm:text-base"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}