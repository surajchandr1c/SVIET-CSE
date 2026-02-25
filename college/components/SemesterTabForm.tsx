"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";

const semesterTabs = [
  "Time Table",
  "Syllabus",
  "Student List",
  "Previous 5 Year Question Paper",
  "Assignment",
  "Notes",
  "PPT",
] as const;

const resourceTabToCategory = {
  Assignment: "assignment",
  Notes: "notes",
  PPT: "ppt",
} as const;

type SemesterTabFormProps = {
  semesterName: string;
  semesterKey: "4th" | "6th";
};

type SyllabusItem = {
  _id?: string;
  semester: string;
  title: string;
  code: string;
  link: string;
};

type StudentItem = {
  _id?: string;
  semester: string;
  admissionNo: string;
  name: string;
};

type QuestionPaperItem = {
  _id?: string;
  semester: string;
  title: string;
  code: string;
  link: string;
};

type StudyResourceItem = {
  _id?: string;
  semester: string;
  category: "assignment" | "notes" | "ppt";
  title: string;
  code: string;
  link: string;
};

const initialSyllabusForm = { title: "", code: "", link: "" };
const initialStudentForm = { name: "", admissionNo: "" };
const initialQuestionPaperForm = { title: "", code: "", link: "" };
const initialResourceForm = { title: "", code: "", link: "" };

export default function SemesterTabForm({ semesterName, semesterKey }: SemesterTabFormProps) {
  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [studentLoading, setStudentLoading] = useState(false);
  const [paperLoading, setPaperLoading] = useState(false);
  const [resourceLoading, setResourceLoading] = useState(false);

  const [syllabusList, setSyllabusList] = useState<SyllabusItem[]>([]);
  const [editingSyllabusId, setEditingSyllabusId] = useState<string | null>(null);
  const [syllabusForm, setSyllabusForm] = useState(initialSyllabusForm);

  const [studentList, setStudentList] = useState<StudentItem[]>([]);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [studentForm, setStudentForm] = useState(initialStudentForm);

  const [paperList, setPaperList] = useState<QuestionPaperItem[]>([]);
  const [editingPaperId, setEditingPaperId] = useState<string | null>(null);
  const [paperForm, setPaperForm] = useState(initialQuestionPaperForm);

  const [resourceList, setResourceList] = useState<StudyResourceItem[]>([]);
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [resourceForm, setResourceForm] = useState(initialResourceForm);

  const resourceCategory = useMemo(() => {
    if (!selectedTab) return null;
    return resourceTabToCategory[selectedTab as keyof typeof resourceTabToCategory] ?? null;
  }, [selectedTab]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedTab) return;
    alert(`${selectedTab} form is open for ${semesterName}.`);
  };

  const fetchSyllabus = useCallback(async () => {
    const res = await fetch(`/api/syllabus?semester=${semesterKey}`);
    const data = await res.json();
    setSyllabusList(data);
  }, [semesterKey]);

  useEffect(() => {
    if (selectedTab !== "Syllabus") return;
    fetchSyllabus();
  }, [selectedTab, fetchSyllabus]);

  const fetchStudents = useCallback(async () => {
    const res = await fetch(`/api/students?semester=${semesterKey}`);
    const data = await res.json();
    setStudentList(data);
  }, [semesterKey]);

  useEffect(() => {
    if (selectedTab !== "Student List") return;
    fetchStudents();
  }, [selectedTab, fetchStudents]);

  const fetchPapers = useCallback(async () => {
    const res = await fetch(`/api/question-papers?semester=${semesterKey}`);
    const data = await res.json();
    setPaperList(data);
  }, [semesterKey]);

  useEffect(() => {
    if (selectedTab !== "Previous 5 Year Question Paper") return;
    fetchPapers();
  }, [selectedTab, fetchPapers]);

  const fetchResources = useCallback(async () => {
    if (!resourceCategory) return;
    const res = await fetch(
      `/api/study-resources?semester=${semesterKey}&category=${resourceCategory}`
    );
    const data = await res.json();
    setResourceList(data);
  }, [semesterKey, resourceCategory]);

  useEffect(() => {
    if (!resourceCategory) return;
    fetchResources();
  }, [resourceCategory, fetchResources]);

  const handleSyllabusChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSyllabusForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetSyllabusForm = () => {
    setEditingSyllabusId(null);
    setSyllabusForm(initialSyllabusForm);
  };

  const handleSyllabusSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isEditMode = Boolean(editingSyllabusId);
      const endpoint = isEditMode ? `/api/syllabus/${editingSyllabusId}` : "/api/syllabus";
      const res = await fetch(endpoint, {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ semester: semesterKey, ...syllabusForm }),
      });
      if (!res.ok) throw new Error("Failed");
      alert(isEditMode ? "Syllabus updated successfully!" : "Syllabus added successfully!");
      resetSyllabusForm();
      fetchSyllabus();
    } catch {
      alert(editingSyllabusId ? "Error updating syllabus" : "Error adding syllabus");
    } finally {
      setLoading(false);
    }
  };

  const handleSyllabusEdit = (item: SyllabusItem) => {
    if (!item._id) return;
    setEditingSyllabusId(item._id);
    setSyllabusForm({ title: item.title, code: item.code, link: item.link });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSyllabusDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this syllabus item?")) return;
    const res = await fetch(`/api/syllabus/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    if (editingSyllabusId === id) resetSyllabusForm();
    fetchSyllabus();
  };

  const handleStudentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudentForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetStudentForm = () => {
    setEditingStudentId(null);
    setStudentForm(initialStudentForm);
  };

  const handleStudentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStudentLoading(true);
    try {
      const isEditMode = Boolean(editingStudentId);
      const endpoint = isEditMode ? `/api/students/${editingStudentId}` : "/api/students";
      const res = await fetch(endpoint, {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ semester: semesterKey, ...studentForm }),
      });
      if (!res.ok) throw new Error("Failed");
      alert(isEditMode ? "Student updated successfully!" : "Student added successfully!");
      resetStudentForm();
      fetchStudents();
    } catch {
      alert(editingStudentId ? "Error updating student" : "Error adding student");
    } finally {
      setStudentLoading(false);
    }
  };

  const handleStudentEdit = (item: StudentItem) => {
    if (!item._id) return;
    setEditingStudentId(item._id);
    setStudentForm({ name: item.name, admissionNo: item.admissionNo });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStudentDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    if (editingStudentId === id) resetStudentForm();
    fetchStudents();
  };

  const handlePaperChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaperForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetPaperForm = () => {
    setEditingPaperId(null);
    setPaperForm(initialQuestionPaperForm);
  };

  const handlePaperSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPaperLoading(true);
    try {
      const isEditMode = Boolean(editingPaperId);
      const endpoint = isEditMode ? `/api/question-papers/${editingPaperId}` : "/api/question-papers";
      const res = await fetch(endpoint, {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ semester: semesterKey, ...paperForm }),
      });
      if (!res.ok) throw new Error("Failed");
      alert(isEditMode ? "Question paper updated successfully!" : "Question paper added successfully!");
      resetPaperForm();
      fetchPapers();
    } catch {
      alert(editingPaperId ? "Error updating question paper" : "Error adding question paper");
    } finally {
      setPaperLoading(false);
    }
  };

  const handlePaperEdit = (item: QuestionPaperItem) => {
    if (!item._id) return;
    setEditingPaperId(item._id);
    setPaperForm({ title: item.title, code: item.code, link: item.link });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaperDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question paper item?")) return;
    const res = await fetch(`/api/question-papers/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    if (editingPaperId === id) resetPaperForm();
    fetchPapers();
  };

  const handleResourceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResourceForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetResourceForm = () => {
    setEditingResourceId(null);
    setResourceForm(initialResourceForm);
  };

  const handleResourceSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!resourceCategory) return;
    setResourceLoading(true);
    try {
      const isEditMode = Boolean(editingResourceId);
      const endpoint = isEditMode ? `/api/study-resources/${editingResourceId}` : "/api/study-resources";
      const res = await fetch(endpoint, {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ semester: semesterKey, category: resourceCategory, ...resourceForm }),
      });
      if (!res.ok) throw new Error("Failed");
      alert(isEditMode ? "Resource updated successfully!" : "Resource added successfully!");
      resetResourceForm();
      fetchResources();
    } catch {
      alert(editingResourceId ? "Error updating resource" : "Error adding resource");
    } finally {
      setResourceLoading(false);
    }
  };

  const handleResourceEdit = (item: StudyResourceItem) => {
    if (!item._id) return;
    setEditingResourceId(item._id);
    setResourceForm({ title: item.title, code: item.code, link: item.link });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResourceDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource item?")) return;
    const res = await fetch(`/api/study-resources/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    if (editingResourceId === id) resetResourceForm();
    fetchResources();
  };

  const isResourceTab = Boolean(resourceCategory);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="admin-card p-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--admin-text-muted)]">
          {semesterName}
        </p>
        <h1 className="text-3xl font-bold text-[var(--admin-text)] md:text-4xl">
          Manage {semesterName}
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] text-[var(--admin-text-muted)] md:text-base">
          Select any tab to open its form.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {semesterTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSelectedTab(tab)}
            className={`cursor-pointer text-left border rounded-xl px-5 py-4 transition ${
              selectedTab === tab
                ? "bg-[#0b3c5d] text-white border-[#0b3c5d]"
                : "bg-white text-slate-800 hover:-translate-y-0.5 hover:border-[#0b3c5d] hover:bg-slate-50 hover:text-slate-900 hover:shadow-md"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {selectedTab === "Syllabus" && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{editingSyllabusId ? "Edit Syllabus" : "Add Syllabus"}</h2>
          <form onSubmit={handleSyllabusSubmit} className="space-y-4">
            <input type="text" name="title" value={syllabusForm.title} onChange={handleSyllabusChange} placeholder="Subject Heading" className="w-full border rounded-lg px-4 py-2" required />
            <input type="text" name="code" value={syllabusForm.code} onChange={handleSyllabusChange} placeholder="Subject Code" className="w-full border rounded-lg px-4 py-2" required />
            <input type="text" name="link" value={syllabusForm.link} onChange={handleSyllabusChange} placeholder="Syllabus Link" className="w-full border rounded-lg px-4 py-2" required />
            <div className="flex gap-3">
              <button type="button" onClick={resetSyllabusForm} className="px-6 py-2 border rounded-lg">{editingSyllabusId ? "Cancel Edit" : "Reset"}</button>
              <button type="submit" disabled={loading} className="px-6 py-2 bg-[#0b3c5d] hover:bg-[#0f4f79] text-white rounded-lg disabled:opacity-50">{loading ? (editingSyllabusId ? "Updating..." : "Adding...") : editingSyllabusId ? "Update Syllabus" : "Add Syllabus"}</button>
            </div>
          </form>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {syllabusList.map((item, index) => (
              <div key={item._id ?? `${item.title}-${index}`} className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-600">
                <h4 className="font-semibold text-slate-800">{item.title}</h4>
                <p className="text-sm font-semibold text-slate-600 mb-3">{item.code}</p>
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline">Open Syllabus</a>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => handleSyllabusEdit(item)} className="bg-amber-500 text-white px-3 py-1 rounded-lg">Edit</button>
                  <button onClick={() => item._id && handleSyllabusDelete(item._id)} disabled={!item._id} className="bg-red-500 text-white px-3 py-1 rounded-lg disabled:opacity-50">Delete</button>
                </div>
              </div>
            ))}
          </div>
          {syllabusList.length === 0 && <p className="text-gray-500 mt-4">No syllabus added yet.</p>}
        </div>
      )}

      {selectedTab === "Student List" && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{editingStudentId ? "Edit Student" : "Add Student"}</h2>
          <form onSubmit={handleStudentSubmit} className="space-y-4">
            <input type="text" name="name" value={studentForm.name} onChange={handleStudentChange} placeholder="Student Name" className="w-full border rounded-lg px-4 py-2" required />
            <input type="text" name="admissionNo" value={studentForm.admissionNo} onChange={handleStudentChange} placeholder="Admission No." className="w-full border rounded-lg px-4 py-2" required />
            <div className="flex gap-3">
              <button type="button" onClick={resetStudentForm} className="px-6 py-2 border rounded-lg">{editingStudentId ? "Cancel Edit" : "Reset"}</button>
              <button type="submit" disabled={studentLoading} className="px-6 py-2 bg-[#0b3c5d] hover:bg-[#0f4f79] text-white rounded-lg disabled:opacity-50">{studentLoading ? (editingStudentId ? "Updating..." : "Adding...") : editingStudentId ? "Update Student" : "Add Student"}</button>
            </div>
          </form>
          <div className="mt-8 overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-sky-900 text-white"><tr><th className="py-2 px-4 border">Sr. No.</th><th className="py-2 px-4 border">Admission No.</th><th className="py-2 px-4 border">Name</th><th className="py-2 px-4 border">Actions</th></tr></thead>
              <tbody>
                {studentList.map((student, index) => (
                  <tr key={student._id ?? `${student.admissionNo}-${index}`} className="text-center hover:bg-gray-100">
                    <td className="py-2 px-4 border">{index + 1}</td><td className="py-2 px-4 border">{student.admissionNo}</td><td className="py-2 px-4 border">{student.name}</td>
                    <td className="py-2 px-4 border"><div className="flex gap-2 justify-center"><button onClick={() => handleStudentEdit(student)} className="bg-amber-500 text-white px-3 py-1 rounded-lg">Edit</button><button onClick={() => student._id && handleStudentDelete(student._id)} disabled={!student._id} className="bg-red-500 text-white px-3 py-1 rounded-lg disabled:opacity-50">Delete</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {studentList.length === 0 && <p className="text-gray-500 mt-4">No students added yet.</p>}
        </div>
      )}

      {selectedTab === "Previous 5 Year Question Paper" && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{editingPaperId ? "Edit Question Paper" : "Add Question Paper"}</h2>
          <form onSubmit={handlePaperSubmit} className="space-y-4">
            <input type="text" name="title" value={paperForm.title} onChange={handlePaperChange} placeholder="Subject Heading" className="w-full border rounded-lg px-4 py-2" required />
            <input type="text" name="code" value={paperForm.code} onChange={handlePaperChange} placeholder="Subject Code" className="w-full border rounded-lg px-4 py-2" required />
            <input type="text" name="link" value={paperForm.link} onChange={handlePaperChange} placeholder="Question Paper Link" className="w-full border rounded-lg px-4 py-2" required />
            <div className="flex gap-3">
              <button type="button" onClick={resetPaperForm} className="px-6 py-2 border rounded-lg">{editingPaperId ? "Cancel Edit" : "Reset"}</button>
              <button type="submit" disabled={paperLoading} className="px-6 py-2 bg-[#0b3c5d] hover:bg-[#0f4f79] text-white rounded-lg disabled:opacity-50">{paperLoading ? (editingPaperId ? "Updating..." : "Adding...") : editingPaperId ? "Update Question Paper" : "Add Question Paper"}</button>
            </div>
          </form>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paperList.map((item, index) => (
              <div key={item._id ?? `${item.title}-${index}`} className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-600">
                <h4 className="font-semibold text-slate-800">{item.title}</h4>
                <p className="text-sm font-semibold text-slate-600 mb-3">{item.code}</p>
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline">Open Folder</a>
                <div className="mt-4 flex gap-2"><button onClick={() => handlePaperEdit(item)} className="bg-amber-500 text-white px-3 py-1 rounded-lg">Edit</button><button onClick={() => item._id && handlePaperDelete(item._id)} disabled={!item._id} className="bg-red-500 text-white px-3 py-1 rounded-lg disabled:opacity-50">Delete</button></div>
              </div>
            ))}
          </div>
          {paperList.length === 0 && <p className="text-gray-500 mt-4">No question papers added yet.</p>}
        </div>
      )}

      {isResourceTab && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{editingResourceId ? `Edit ${selectedTab}` : `Add ${selectedTab}`}</h2>
          <form onSubmit={handleResourceSubmit} className="space-y-4">
            <input type="text" name="title" value={resourceForm.title} onChange={handleResourceChange} placeholder="Subject Heading" className="w-full border rounded-lg px-4 py-2" required />
            <input type="text" name="code" value={resourceForm.code} onChange={handleResourceChange} placeholder="Subject Code" className="w-full border rounded-lg px-4 py-2" required />
            <input type="text" name="link" value={resourceForm.link} onChange={handleResourceChange} placeholder="Resource Link" className="w-full border rounded-lg px-4 py-2" required />
            <div className="flex gap-3">
              <button type="button" onClick={resetResourceForm} className="px-6 py-2 border rounded-lg">{editingResourceId ? "Cancel Edit" : "Reset"}</button>
              <button type="submit" disabled={resourceLoading} className="px-6 py-2 bg-[#0b3c5d] hover:bg-[#0f4f79] text-white rounded-lg disabled:opacity-50">{resourceLoading ? (editingResourceId ? "Updating..." : "Adding...") : editingResourceId ? `Update ${selectedTab}` : `Add ${selectedTab}`}</button>
            </div>
          </form>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resourceList.map((item, index) => (
              <div key={item._id ?? `${item.title}-${index}`} className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-600">
                <h4 className="font-semibold text-slate-800">{item.title}</h4>
                <p className="text-sm font-semibold text-slate-600 mb-3">{item.code}</p>
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline">Open Resource</a>
                <div className="mt-4 flex gap-2"><button onClick={() => handleResourceEdit(item)} className="bg-amber-500 text-white px-3 py-1 rounded-lg">Edit</button><button onClick={() => item._id && handleResourceDelete(item._id)} disabled={!item._id} className="bg-red-500 text-white px-3 py-1 rounded-lg disabled:opacity-50">Delete</button></div>
              </div>
            ))}
          </div>
          {resourceList.length === 0 && <p className="text-gray-500 mt-4">No data added yet.</p>}
        </div>
      )}

      {selectedTab && !isResourceTab && selectedTab !== "Syllabus" && selectedTab !== "Student List" && selectedTab !== "Previous 5 Year Question Paper" && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Form</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" value={selectedTab} readOnly className="w-full border rounded-lg px-4 py-2 bg-gray-50" />
            <button type="submit" className="px-6 py-2 bg-[#0b3c5d] hover:bg-[#0f4f79] text-white rounded-lg">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
}
