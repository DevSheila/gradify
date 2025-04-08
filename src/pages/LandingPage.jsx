import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Calculator, FileText } from "lucide-react";

const features = [
  {
    icon: <GraduationCap className="h-6 w-6" />,
    title: "Easy Grading",
    description: "Streamline your grading process with our intuitive interface.",
  },
  {
    icon: <Calculator className="h-6 w-6" />,
    title: "Automatic GPA Calculation",
    description: "Let our system handle complex GPA calculations automatically.",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Transcript Generation",
    description: "Generate professional transcripts with just a few clicks.",
  },
];

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center">
      <section className="py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
          Simplify Your Academic
          <span className="text-primary"> Grading Process</span>
        </h1>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto mb-8">
          Transform the way you manage student grades and transcripts with our
          powerful and easy-to-use platform.
        </p>
        <Button size="lg" className="font-semibold" asChild>
          <Link to="/dashboard">Get Started</Link>
        </Button>
      </section>

      <section className="w-full py-20 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Gradify?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-lg bg-card"
              >
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 