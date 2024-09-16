import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "./Button";
import { UseFormSetValue } from "react-hook-form";

interface FormInput {
  [key: string]: string | boolean;
}

interface CorpusEntry {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

interface Question {
  id: string;
  label: string;
}

interface CorpusFormProps {
  caseId: number;
  setValue?: UseFormSetValue<FormInput>;
  questions: Question[];
}

export default function CorpusForm({
  caseId,
  setValue,
  a,
  questions,
}: CorpusFormProps) {
  console.log("questions", questions, "setValue", setValue);
  console.log("a", a);
  const [corpus, setCorpus] = useState<CorpusEntry[]>([]);
  const [newEntry, setNewEntry] = useState("");
  const [newEntryTitle, setNewEntryTitle] = useState("");
  const [expandedEntries, setExpandedEntries] = useState<number[]>([]);
  const [isAddingCorpus, setIsAddingCorpus] = useState(false);

  const fetchCorpus = useCallback(async () => {
    try {
      const response = await axios.get(`/api/corpus?caseId=${caseId}`);
      setCorpus(response.data);
    } catch (error) {
      console.error("Error fetching corpus:", error);
      toast.error("Failed to fetch corpus");
    }
  }, [caseId]);

  useEffect(() => {
    fetchCorpus();
  }, [caseId, fetchCorpus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.trim() || !newEntryTitle.trim()) return;

    setIsAddingCorpus(true);
    try {
      const response = await axios.post("/api/corpus", {
        caseId,
        title: newEntryTitle,
        content: newEntry,
      });
      setCorpus([response.data, ...corpus]);
      setNewEntry("");
      setNewEntryTitle("");
      toast.success("Entry added to corpus successfully");
    } catch (error) {
      console.error("Error adding entry to corpus:", error);
      toast.error("Failed to add entry to corpus");
    } finally {
      setIsAddingCorpus(false);
    }
  };

  const runAQA = useCallback(
    async (corpusId: number) => {
      try {
        for (const question of questions) {
          const response = await axios.post("/api/aqa", {
            corpusId,
            question: question,
          });
          console.log(
            `Response for question "${question.label}":`,
            response.data
          );
          if (setValue) {
            console.log(
              "question.id",
              question.id,
              "response.data.answer",
              response.data.answer
            );
            setValue(question.id.toString(), response.data.answer);
          }
        }

        toast.success("AQA run successfully for all questions");
      } catch (error) {
        console.error("Error running AQA:", error);
        toast.error("Failed to run AQA");
      }
    },
    [questions, setValue]
  );

  const toggleExpand = (id: number) => {
    setExpandedEntries((prev) =>
      prev.includes(id)
        ? prev.filter((entryId) => entryId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Case Corpus</h2>
        <div className="mb-4 max-h-60 overflow-y-auto">
          {corpus.map((entry) => (
            <div
              key={entry.id}
              className="mb-2 p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors duration-200"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">{entry.title}</h3>
                <Button
                  onClick={() => runAQA(entry.id)}
                  variant="primary"
                  size="sm"
                >
                  Run AQA
                </Button>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => toggleExpand(entry.id)}
              >
                {expandedEntries.includes(entry.id) ? (
                  <>
                    <p>{entry.content}</p>
                    <small className="text-gray-500">
                      {new Date(entry.createdAt).toLocaleString()}
                    </small>
                  </>
                ) : (
                  <p>{entry.content.slice(0, 100)}...</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            value={newEntryTitle}
            onChange={(e) => setNewEntryTitle(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder="Enter title for the new entry..."
            disabled={isAddingCorpus}
          />
          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Enter content for the new entry..."
            disabled={isAddingCorpus}
          />
          <div className="flex justify-end w-full">
            <Button
              type="submit"
              variant="reverse-primary"
              spinner={isAddingCorpus}
            >
              Add to Corpus
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
