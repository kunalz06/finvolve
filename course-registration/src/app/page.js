import RegistrationForm from "@/components/RegistrationForm";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Minor Degree Course Registration</h1>
        <p className="text-gray-600">Please fill out the form below to register for your minor degree.</p>
      </div>
      <RegistrationForm />
    </div>
  );
}
