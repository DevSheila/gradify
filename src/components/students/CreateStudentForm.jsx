import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const studentSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  schoolId: z.string().min(6, 'School ID must be at least 6 characters'),
  year: z.string().regex(/^\d{4}$/, 'Year must be a 4-digit number'),
  schoolName: z.string().min(2, 'School name must be at least 2 characters'),
});

const CreateStudentForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: '',
      schoolId: '',
      year: new Date().getFullYear().toString(),
      schoolName: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const studentData = {
        ...data,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'students'), studentData);

      toast({
        title: 'Success!',
        description: 'Student created successfully.',
        variant: 'success',
      });

      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create student. Please try again.',
        variant: 'destructive',
      });
      console.error('Error creating student:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">Create New Student</h2>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="schoolId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School ID</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input placeholder="2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="schoolName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Baeburn High School" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Student'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateStudentForm; 