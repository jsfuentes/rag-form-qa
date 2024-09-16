import { useState, useEffect } from "react";
import Head from "next/head";
import Navbar from "src/components/Navbar";
import Footer from "src/components/Footer";
import FormBuilder from "src/components/FormBuilder";
import FormRenderer from "src/components/FormRenderer";
import AppNavbar from "src/components/AppNavbar";
import { useForm, useFieldArray } from "react-hook-form";

export default function Landing() {
  const { control, handleSubmit, register, watch } = useForm({
    defaultValues: {
      questions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const watchFields = watch("questions");

  useEffect(() => {
    console.log("Fields updated:", watchFields);
  }, [watchFields]);

  return (
    <>
      <Head>
        <title>Form Builder</title>
        <meta
          name="description"
          content="Build and preview forms in real-time"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <AppNavbar />

      <div className="w-full p-8">
        <div className="flex flex-row space-x-4">
          <div className="w-1/2">
            <h2 className="text-2xl font-bold mb-4">Form Builder</h2>
            <FormBuilder
              register={register}
              handleSubmit={handleSubmit}
              append={append}
              remove={remove}
              fields={fields}
            />
          </div>
          <div className="w-1/2">
            <h2 className="text-2xl font-bold mb-4">Form Preview</h2>
            <FormRenderer fields={watchFields} />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
