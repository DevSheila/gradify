import { useState, useEffect } from 'react';
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
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const studentSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  schoolId: z.string().min(6, 'School ID must be at least 6 characters'),
  year: z.string().regex(/^\d{4}$/, 'Year must be a 4-digit number'),
  schoolName: z.string().min(2, 'School name must be at least 2 characters'),
});

const EditStudentForm = ({ student, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: student.fullName,
      schoolId: student.schoolId,
      year: student.year,
      schoolName: student.schoolName,
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const studentRef = doc(db, 'students', student.id);
      
      await updateDoc(studentRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: 'Success!',
        description: 'Student details updated successfully.',
        variant: 'success',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update student details. Please try again.',
        variant: 'destructive',
      });
      console.error('Error updating student:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">Edit Student Details</h2>
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
                    <Input {...field} />
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
                    <Input {...field} />
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
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditStudentForm; 