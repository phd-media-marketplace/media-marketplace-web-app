import { Card } from "@/components/ui/card";

interface Step {
    num: number;
    title: string;
}

interface ProgressStepsProps {
    currentStep: number;
    steps: Step[];
}

export default function ProgressSteps({ currentStep, steps }: ProgressStepsProps) {
    return (
        <Card className="p-6 border border-primary/10 rounded-lg shadow-md mb-6">
            <div className="flex items-center justify-between">
                {steps.map((step, idx) => (
                    <div key={step.num} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                                currentStep >= step.num 
                                    ? 'bg-primary text-white' 
                                    : 'bg-gray-200 text-gray-600'
                            }`}>
                                {step.num}
                            </div>
                            <span className={`text-sm mt-2 font-medium ${
                                currentStep >= step.num ? 'text-primary' : 'text-gray-600'
                            }`}>
                                {step.title}
                            </span>
                        </div>
                        {idx < steps.length - 1 && (
                            <div className={`h-1 flex-1 transition-all ${
                                currentStep > step.num ? 'bg-primary' : 'bg-gray-200'
                            }`} />
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
}
