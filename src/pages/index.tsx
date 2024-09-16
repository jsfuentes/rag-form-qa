import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import Navbar from "src/components/Navbar";
import Footer from "src/components/Footer";
import AppNavbar from "src/components/AppNavbar";
import Button from "src/components/Button";

export default function Landing() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const createForm = async () => {
    setIsCreating(true);
    try {
      const response = await axios.post("/api/form", {
        name: "New Form",
        questions: [],
      });
      const newForm = response.data;
      router.push(`/forms/${newForm.id}`);
    } catch (error) {
      console.error("Error creating form:", error);
      setIsCreating(false);
    }
  };

  return (
    <>
      <Head>
        <title>Form Builder</title>
        <meta name="description" content="Create and manage forms" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <AppNavbar />

      <div className="w-full p-8">
        <div className="flex justify-center">
          <Button onClick={createForm} disabled={isCreating}>
            {isCreating ? "Creating..." : "Create New Form"}
          </Button>
        </div>
      </div>

      <Footer />
    </>
  );
}
