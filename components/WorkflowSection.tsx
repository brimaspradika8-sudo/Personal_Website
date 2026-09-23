"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

const WORKFLOW_STEPS = [
  {
    id: "01",
    title: "Analyze",
    subtitle: "Understanding the problem first.",
    description:
      "Analyze the problem, user needs, and project goals before deciding what to build.",
    focus: ["Problem", "User Needs", "Goals", "Research"],
  },
  {
    id: "02",
    title: "Plan",
    subtitle: "Turning ideas into a clear direction.",
    description:
      "Define the features, technology, and development flow needed to solve the problem.",
    focus: ["Solution", "Features", "Tech", "Flow"],
  },
  {
    id: "03",
    title: "Design",
    subtitle: "Designing the experience.",
    description:
      "Create the structure, user flow, wireframes, and interface before turning the idea into code.",
    focus: ["Wireframe", "UI/UX", "Layout", "Flow"],
  },
  {
    id: "04",
    title: "Develop",
    subtitle: "Turning ideas into working software.",
    description:
      "Implement the design into functional software by building the frontend, backend, API, and database.",
    focus: ["Frontend", "Backend", "API", "Database"],
  },
  {
    id: "05",
    title: "Test",
    subtitle: "Making sure everything works.",
    description:
      "Test the features, find bugs, and make sure the application works as expected.",
    focus: ["QA", "Debugging", "Edge Cases", "Integration"],
  },
  {
    id: "06",
    title: "Improve",
    subtitle: "Making it better.",
    description:
      "Evaluate the result, fix problems, and improve performance, usability, security, and code quality.",
    focus: ["Performance", "UX", "Security", "Optimization"],
  },
  {
    id: "07",
    title: "Deploy",
    subtitle: "Bringing the project to life.",
    description:
      "Prepare the application for production, deploy it, and continue improving it based on real usage.",
    focus: ["Production", "Deploy", "Monitoring", "Maintenance"],
  },
];

export default function WorkflowSection() {
  const [activeStep, setActiveStep] = useState(0);

  const currentStep = WORKFLOW_STEPS[activeStep];
  const isLastStep = activeStep === WORKFLOW_STEPS.length - 1;

  const connectorState = useMemo(
    () =>
      WORKFLOW_STEPS.map((_, index) => ({
        isActive: index <= activeStep,
        isCurrent: index === activeStep,
      })),
    [activeStep]
  );

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < WORKFLOW_STEPS.length) {
      setActiveStep(stepIndex);
    }
  };

  return (
    <section
      id="workflow"
      className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20 border-b-2 border-slate-900 dark:border-white text-left"
    >
      <div className="space-y-8 sm:space-y-10">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-[#166534] text-white border-2 border-slate-900 dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] text-[11px] font-bold tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
            Process
          </div>

          <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tight text-slate-950 dark:text-white leading-none">
            My <span className="text-[#166534] underline decoration-4 underline-offset-4">Workflow</span>
          </h2>

          <p className="text-xs sm:text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
            From understanding problems to building and improving solutions.
          </p>
        </div>

        <div className="rounded-3xl border-2 border-slate-900 dark:border-white bg-white dark:bg-[#0E121D] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] p-3 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
            {WORKFLOW_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <button
                  type="button"
                  aria-current={index === activeStep ? "step" : undefined}
                  aria-label={`Open ${step.title} workflow step`}
                  onClick={() => goToStep(index)}
                  className={`group relative flex w-full items-center gap-2.5 rounded-2xl border-2 px-2.5 py-2.5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#166534]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0E121D] ${
                    index === activeStep
                      ? "border-slate-900 bg-[#EAB308] text-slate-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                      : index < activeStep
                      ? "border-[#166534] bg-[#DCFCE7] text-slate-950"
                      : "border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  }`}>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 text-[10px] font-black transition-all duration-300 ${
                      index === activeStep
                        ? "border-slate-900 bg-slate-950 text-[#EAB308]"
                        : index < activeStep
                        ? "border-[#166534] bg-[#166534] text-white"
                        : "border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                    }`}
                  >
                    {index < activeStep ? <Check className="h-3.5 w-3.5" /> : step.id}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-black uppercase tracking-[0.18em] opacity-80">
                      {step.id}
                    </span>
                    <span className="block truncate text-[11px] font-bold sm:text-xs">
                      {step.title}
                    </span>
                  </span>
                </button>

                {index < WORKFLOW_STEPS.length - 1 && (
                  <div
                    className={`hidden h-1 flex-1 rounded-full transition-all duration-300 sm:block ${
                      connectorState[index].isActive ? "bg-[#166534]" : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border-2 border-slate-900 dark:border-white bg-[#F8FAFC] dark:bg-[#0A0D14] p-4 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, x: 16, y: 8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: -16, y: -8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-[#EAB308] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {currentStep.id}
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    {activeStep + 1} / {WORKFLOW_STEPS.length}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-slate-950 dark:text-white leading-none">
                    {currentStep.title}
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-[#166534] dark:text-[#EAB308]">
                    {currentStep.subtitle}
                  </p>
                </div>

                <p className="max-w-2xl text-sm sm:text-base font-medium leading-relaxed text-slate-700 dark:text-slate-200">
                  {currentStep.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {currentStep.focus.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border-2 border-slate-900 bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-[#0E121D] dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => goToStep(activeStep - 1)}
                    disabled={activeStep === 0}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-45 disabled:shadow-none dark:border-white dark:bg-[#0E121D] dark:text-white dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={() => goToStep(activeStep + 1)}
                    disabled={isLastStep}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-[#166534] px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:bg-[#14532D] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-45 disabled:shadow-none"
                  >
                    {isLastStep ? "Complete" : "Next"}
                    {!isLastStep && <ArrowRight className="h-4 w-4" />}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
