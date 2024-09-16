import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm, useFieldArray } from "react-hook-form";
import Navbar from "src/components/Navbar";
import Footer from "src/components/Footer";
import FormBuilder from "src/components/FormBuilder";
import FormRenderer from "src/components/FormRenderer";
import AppNavbar from "src/components/AppNavbar";
import axios from "axios";

export default function FormFetcher() {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`/api/form?id=${id}`);
        if (response.status === 200) {
          setFormData(response.data);
        } else {
          console.error("Failed to fetch form data");
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchFormData();
    }
  }, [id, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <FormPage formData={formData} />;
}

function FormPage(props: { formData: any }) {
  console.log("formData", props.formData);

  const { control, handleSubmit, register, watch } = useForm({
    defaultValues: {
      questions: props.formData ? props.formData.questions : [],
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

      <AppNavbar />

      {/* <div>
        <h1>Form Details</h1>
        <p>ID: {JSON.stringify(props.formData)}</p>
      </div> */}

      <div className="w-full p-8">
        <div className="flex flex-row space-x-4">
          <div className="w-1/2">
            <h2 className="text-2xl font-bold mb-4">Form Builder</h2>
            <FormBuilder
              formId={props.formData.id}
              register={register}
              handleSubmit={handleSubmit}
              append={append}
              remove={remove}
              fields={fields}
            />
          </div>
          <div className="w-1/2">
            <h2 className="text-2xl font-bold mb-4">Form Preview</h2>
            <FormRenderer fields={watchFields} formId={props.formData.id} />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
