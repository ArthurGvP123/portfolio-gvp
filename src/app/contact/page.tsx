import type { Metadata } from "next";
import { ContactNeuralMesh } from "@/components/contact/ContactNeuralMesh";

export const metadata: Metadata = {
  title: "Contact - ArthurGvP",
  description:
    "Get in touch with Arthur Gregorius Pongoh — Systems Architect & Creative Technologist.",
};

export default function ContactPage() {
  return (
    <main className="w-full min-h-screen bg-background">
      <ContactNeuralMesh />
    </main>
  );
}
