import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const grades = [
  { label: "A+", value: "A+", points: 4.0 },
  { label: "A", value: "A", points: 4.0 },
  { label: "A-", value: "A-", points: 3.7 },
  { label: "B+", value: "B+", points: 3.3 },
  { label: "B", value: "B", points: 3.0 },
  { label: "B-", value: "B-", points: 2.7 },
  { label: "C+", value: "C+", points: 2.3 },
  { label: "C", value: "C", points: 2.0 },
  { label: "C-", value: "C-", points: 1.7 },
  { label: "D+", value: "D+", points: 1.3 },
  { label: "D", value: "D", points: 1.0 },
  { label: "F", value: "F", points: 0.0 },
];

const gradeLevels = ["9", "10", "11", "12"];

const unitSchema = z.object({
  code: z.string().min(2, "Course code is required"),
  name: z.string().min(2, "Course name is required"),
  grade: z.string().min(1, "Grade is required"),
  creditHours: z.coerce.number().min(0.5, "Credit hours must be at least 0.5"),
});

const transcriptSchema = z.object({
  schoolYear: z.string().min(9, "School year is required (e.g., 2023-2024)"),
  gradeLevel: z.string().min(1, "Grade level is required"),
  units: z.array(unitSchema).min(1, "Add at least one course"),
});

const TranscriptForm = ({ studentId, student, onSuccess }) => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(transcriptSchema),
    defaultValues: {
      schoolYear: "",
      gradeLevel: "",
      units: [{ code: "", name: "", grade: "", creditHours: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "units",
  });

  const calculateGPA = (units) => {
    let totalPoints = 0;
    let totalHours = 0;

    units.forEach((unit) => {
      const grade = grades.find((g) => g.value === unit.grade);
      if (grade && unit.creditHours) {
        totalPoints += grade.points * unit.creditHours;
        totalHours += unit.creditHours;
      }
    });

    return {
      gpa: totalHours > 0 ? (totalPoints / totalHours).toFixed(2) : 0,
      totalCreditHours: totalHours,
    };
  };

  const { mutate: createTranscript, isLoading } = useMutation({
    mutationFn: async (data) => {
      const { gpa, totalCreditHours } = calculateGPA(data.units);
      const units = data.units.map((unit) => ({
        ...unit,
        gradePoints: grades.find((g) => g.value === unit.grade).points,
      }));

      return addDoc(collection(db, "transcripts"), {
        studentId,
        userId,
        schoolYear: data.schoolYear,
        gradeLevel: data.gradeLevel,
        units,
        gpa: parseFloat(gpa),
        totalCreditHours,
        createdAt: new Date(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["transcripts", studentId]);
      toast.success("Transcript created successfully");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data) => {
    createTranscript(data);
  };

  // Watch form values for real-time GPA calculation
  const watchedUnits = form.watch("units");
  const currentGPA = calculateGPA(watchedUnits);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>School Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="schoolYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Year</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 2023-2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gradeLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {gradeLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Academic Record</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-start">
                <div className="grid grid-cols-4 gap-4 flex-1">
                  <FormField
                    control={form.control}
                    name={`units.${index}.code`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. MATH101" {...field} />
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
                          <Input placeholder="e.g. Mathematics" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`units.${index}.grade`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {grades.map((grade) => (
                              <SelectItem key={grade.value} value={grade.value}>
                                {grade.label}
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
                            placeholder="e.g. 1"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="mt-8"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  ×
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({ code: "", name: "", grade: "", creditHours: "" })
              }
            >
              Add Course
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Academic Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Current GPA</p>
                <p className="text-2xl font-bold">{currentGPA.gpa}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Credit Hours</p>
                <p className="text-2xl font-bold">{currentGPA.totalCreditHours}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Transcript"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/students/${studentId}`)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TranscriptForm; 