import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";
import FormRenderer from "src/components/FormRenderer";
import { toast } from "react-toastify";
import CorpusForm from "src/components/CorpusForm"; // Update this line
import AppNavbar from "src/components/AppNavbar";
import Footer from "src/components/Footer";
import Link from "next/link";
import { UseFormSetValue } from "react-hook-form";

interface FormInput {
  [key: string]: string | boolean;
}

interface Case {
  id: number;
  formId: number;
  answers: Array<{
    id: number;
    value: string;
    formQuestionId: number;
  }>;
}

interface FormField {
  id: string;
  type: string;
  label: string;
}

export default function CasePage() {
  const router = useRouter();
  const { id } = router.query;
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formName, setFormName] = useState<string>("");
  const [setValue, setSetValue] = useState<UseFormSetValue<FormInput>>();

  useEffect(() => {
    const fetchCase = async () => {
      if (id) {
        try {
          const response = await axios.get(`/api/case?id=${id}`);
          setCaseData(response.data);
          console.log("Case data fetched:", response.data);

          // Fetch the form fields
          const formResponse = await axios.get(
            `/api/form?id=${response.data.formId}`
          );
          console.log("Form fields fetched:", formResponse.data.questions);
          setFormFields(formResponse.data.questions);
          setFormName(formResponse.data.name || "Unnamed Form");

          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching case:", error);
          toast.error("Error fetching case. Please try again.");
          setIsLoading(false);
        }
      }
    };

    fetchCase();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!caseData) {
    return <div>Case not found</div>;
  }

  // Prepare the fields with answers for the FormRenderer
  const fieldsWithAnswers = formFields.map((field) => ({
    ...field,
    value:
      caseData.answers.find(
        (answer) => answer.formQuestionId === parseInt(field.id)
      )?.value || "",
  }));

  return (
    <>
      <Head>
        <title>
          {formName} / Case #{caseData.id}
        </title>
        <meta
          name="description"
          content={`View and edit case #${caseData.id}`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppNavbar />

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          <Link href={`/forms/${caseData.formId}`}>
            Form #{caseData.formId}{" "}
          </Link>
          {" / "}
          Case #{caseData.id}
        </h1>
        <div className="flex flex-row space-x-4">
          <div className="w-1/2">
            <FormRenderer
              fields={fieldsWithAnswers}
              formId={caseData.formId}
              isUpdate
              //Needed cuz setState as a function is confused
              setSetValue={(set) => {
                setSetValue(() => {
                  return set;
                });
              }}
            />
          </div>
          <div className="w-1/2">
            <CorpusForm
              caseId={caseData.id}
              setValue={setValue}
              questions={formFields}
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
