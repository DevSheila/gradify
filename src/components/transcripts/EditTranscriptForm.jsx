import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PlusCircle, Trash2 } from 'lucide-react';
import { gradeLevels, academicYears } from '@/lib/validations/transcript';

const unitSchema = z.object({
  code: z.string().min(3, 'Course code must be at least 3 characters'),
  name: z.string().min(3, 'Course name must be at least 3 characters'),
  grade: z.string(),
  creditHours: z.number().min(1, 'Credit hours must be at least 1'),
});

const transcriptSchema = z.object({
  gradeLevel: z.number().min(9).max(12),
  academicYear: z.string().min(9, 'Please enter a valid academic year'),
  units: z.array(unitSchema).min(1, 'Add at least one course'),
});

const grades = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'F': 0.0,
};

const EditTranscriptForm = ({ transcript, student, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(transcriptSchema),
    defaultValues: {
      gradeLevel: transcript.gradeLevel || 9,
      academicYear: transcript.academicYear || academicYears[1],
      units: transcript.units.map(unit => ({
        code: unit.code,
        name: unit.name,
        grade: unit.grade,
        creditHours: unit.creditHours,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'units',
  });

  const calculateGPA = (units) => {
    if (!units || units.length === 0) return 0;
    
    const totalPoints = units.reduce((sum, unit) => {
      const gradePoint = grades[unit.grade] || 0;
      return sum + (gradePoint * unit.creditHours);
    }, 0);
    
    const totalHours = units.reduce((sum, unit) => sum + unit.creditHours, 0);
    
    return totalPoints / totalHours;
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const gpa = calculateGPA(data.units);
      const totalCreditHours = data.units.reduce((sum, unit) => sum + unit.creditHours, 0);

      const transcriptRef = doc(db, 'transcripts', transcript.id);
      
      await updateDoc(transcriptRef, {
        units: data.units,
        gpa,
        totalCreditHours,
        gradeLevel: data.gradeLevel,
        academicYear: data.academicYear,
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: 'Success!',
        description: 'Transcript updated successfully.',
        variant: 'success',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update transcript. Please try again.',
        variant: 'destructive',
      });
      console.error('Error updating transcript:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">Edit Transcript</h2>
        <p className="text-center text-muted-foreground">
          For student: {student.fullName} (ID: {student.schoolId})
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gradeLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade Level</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(gradeLevels).map(([level, label]) => (
                          <SelectItem key={level} value={level}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="academicYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select academic year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {academicYears.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`units.${index}.code`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Course Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`units.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Course Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`units.${index}.grade`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grade</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select grade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.keys(grades).map((grade) => (
                                  <SelectItem key={grade} value={grade}>
                                    {grade}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`units.${index}.creditHours`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Credit Hours</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0.5"
                                step="0.5"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-8"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => append({
                code: '',
                name: '',
                grade: 'A',
                creditHours: 3,
              })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Course
            </Button>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditTranscriptForm; 