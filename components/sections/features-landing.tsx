import { Icons } from "@/components/shared/icons";

const features = [
  {
    icon: <Icons.calendar className="size-6 text-blue-500" />,
    title: "Smart Appointment Scheduling",
    description: "AI-powered optimization to reduce wait times and maximize clinic efficiency."
  },
  {
    icon: <Icons.user className="size-6 text-green-500" />,
    title: "Patient Records",
    description: "Secure, cloud-based storage for patient history, prescriptions, and diagnostics."
  },
  {
    icon: <Icons.barChart className="size-6 text-purple-500" />,
    title: "Real-Time Analytics",
    description: "Insights into patient flow, staff utilization, and operational performance."
  }
];

export default function FeaturesLanding() {
  return (
    <section className="bg-white py-12 dark:bg-background sm:py-20">
      <div className="container text-center">
        <h2 className="mb-10 text-3xl font-bold sm:text-4xl">
          Why Choose Our System?
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="rounded-lg border bg-muted/10 p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
