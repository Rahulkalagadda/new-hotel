import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
              step.number < currentStep
                ? 'bg-[#E53935] border-[#E53935]'
                : step.number === currentStep
                ? 'border-[#E53935] bg-white'
                : 'border-gray-300 bg-white'
            }`}>
              {step.number < currentStep ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <span className={`text-sm font-semibold ${
                  step.number === currentStep ? 'text-[#E53935]' : 'text-gray-400'
                }`}>
                  {step.number}
                </span>
              )}
            </div>
            <span className={`ml-2 text-sm font-medium ${
              step.number === currentStep ? 'text-[#E53935]' : 'text-gray-600'
            }`}>
              {step.title}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-4 ${
              step.number < currentStep ? 'bg-[#E53935]' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}
