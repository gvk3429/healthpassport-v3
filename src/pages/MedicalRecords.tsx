import { useEffect, useState } from "react";
import {
  AlertCircle,
  
  CheckCircle2,
  Clock3,
  FileText,
  FlaskConical,
  FolderOpen,
  Hospital,
  
  Loader2,
  MoreVertical,
  Pill,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { records as initialRecords } from "../data/mockHealthData";

import type { Page } from "../components/AppSidebar";

type RecordStatus =
  | "READY"
  | "UPLOADING"
  | "PROCESSING"
  | "FAILED";

type MedicalRecord = {
  id: number;
  title: string;
  category: string;
  provider: string;
  date: string;
  status: RecordStatus;
  confidence?: number;
};

interface MedicalRecordsProps {
  onNavigate: (page: Page) => void;
}

export default function MedicalRecords({
  onNavigate,
}: MedicalRecordsProps) {
  const [records, setRecords] = useState<MedicalRecord[]>(
    initialRecords.map((record) => ({
      ...record,
      status: "READY",
      confidence: 96,
    }))
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [uploadOpen, setUploadOpen] = useState(false);
  const [processingId, setProcessingId] =
    useState<number | null>(null);

  const [selectedRecord, setSelectedRecord] =
    useState<MedicalRecord | null>(null);

  const [showMenu, setShowMenu] = useState<number | null>(
    null
  );

  const categories = [
    "All",
    "Lab Report",
    "Consultation",
    "Prescription",
    "Hospital",
  ];

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      record.provider
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      record.category === filter;

    return matchesSearch && matchesFilter;
  });

  const startUpload = () => {
    const newId = Date.now();

    const newRecord: MedicalRecord = {
      id: newId,
      title: "Annual Health Checkup",
      category: "Lab Report",
      provider: "Sample Diagnostic Centre",
      date: "07 Sep 2026",
      status: "UPLOADING",
      confidence: 0,
    };

    setRecords((current) => [
      newRecord,
      ...current,
    ]);

    setUploadOpen(false);
    setProcessingId(newId);
  };

  useEffect(() => {
    if (processingId === null) return;

    const uploadingTimer = setTimeout(() => {
      setRecords((current) =>
        current.map((record) =>
          record.id === processingId
            ? {
                ...record,
                status: "PROCESSING",
              }
            : record
        )
      );
    }, 1200);

    const readyTimer = setTimeout(() => {
      setRecords((current) =>
        current.map((record) =>
          record.id === processingId
            ? {
                ...record,
                status: "READY",
                confidence: 97,
              }
            : record
        )
      );

      setProcessingId(null);
    }, 5500);

    return () => {
      clearTimeout(uploadingTimer);
      clearTimeout(readyTimer);
    };
  }, [processingId]);

  const deleteRecord = (id: number) => {
    setRecords((current) =>
      current.filter((record) => record.id !== id)
    );

    setShowMenu(null);
    setSelectedRecord(null);
  };

  const retryRecord = (id: number) => {
    setRecords((current) =>
      current.map((record) =>
        record.id === id
          ? {
              ...record,
              status: "PROCESSING",
            }
          : record
      )
    );

    setProcessingId(id);
    setShowMenu(null);
  };

  return (
    <div className="hp-page-enter mx-auto max-w-[1500px] space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-600">
            <FolderOpen size={14} />
            MY HEALTH
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-blue-950">
            Medical Records
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Keep your medical documents organized, searchable and
            connected to your longitudinal health history.
          </p>
        </div>

        <button
          onClick={() => setUploadOpen(true)}
          className="hp-primary-btn"
        >
          <Plus size={17} />
          Upload Record
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <RecordStat
          label="Total Records"
          value={records.length.toString()}
          icon={<FileText size={18} />}
        />

        <RecordStat
          label="AI Analysed"
          value={records
            .filter((record) => record.status === "READY")
            .length.toString()}
          icon={<Sparkles size={18} />}
        />

        <RecordStat
          label="Lab Reports"
          value={records
            .filter(
              (record) => record.category === "Lab Report"
            )
            .length.toString()}
          icon={<FlaskConical size={18} />}
        />

        <RecordStat
          label="Protected"
          value="100%"
          icon={<ShieldCheck size={18} />}
        />
      </div>

      {/* Search + filters */}
      <section className="hp-card p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search records, hospitals, doctors..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`
                  whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-semibold transition
                  ${
                    filter === category
                      ? "bg-blue-950 text-white"
                      : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Records */}
      <section className="hp-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-bold text-slate-900">
              All Medical Records
            </h2>

            <p className="mt-0.5 text-xs text-slate-400">
              {filteredRecords.length} records
            </p>
          </div>

          <button className="hp-secondary-btn">
            <FolderOpen size={15} />
            Organize
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredRecords.map((record) => (
            <RecordRow
              key={record.id}
              record={record}
              menuOpen={showMenu === record.id}
              onMenu={() =>
                setShowMenu(
                  showMenu === record.id
                    ? null
                    : record.id
                )
              }
              onOpen={() => {
                setSelectedRecord(record);
                setShowMenu(null);
              }}
              onDelete={() =>
                deleteRecord(record.id)
              }
              onRetry={() =>
                retryRecord(record.id)
              }
            />
          ))}

          {filteredRecords.length === 0 && (
            <div className="px-6 py-16 text-center">
              <FileText
                size={35}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 font-semibold text-slate-700">
                No records found
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Try another search or upload a new medical record.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Privacy note */}
      <div className="flex gap-3 rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
        <ShieldCheck
          size={19}
          className="mt-0.5 shrink-0 text-sky-600"
        />

        <div>
          <div className="text-xs font-bold text-slate-800">
            Your records remain under your control
          </div>

          <p className="mt-1 text-[11px] leading-5 text-slate-500">
            This POC simulates secure storage, AI processing and
            record ownership. Production implementation will connect
            these workflows to authenticated storage and access
            controls.
          </p>
        </div>
      </div>

      {/* Upload modal */}
      {uploadOpen && (
        <UploadModal
          onClose={() => setUploadOpen(false)}
          onUpload={startUpload}
        />
      )}

      {/* Processing modal */}
      {processingId !== null && (
        <ProcessingModal />
      )}

      {/* Record details */}
      {selectedRecord && (
        <RecordDetailsModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onTimeline={() => {
            setSelectedRecord(null);
            onNavigate("timeline");
          }}
          onTrends={() => {
            setSelectedRecord(null);
            onNavigate("trends");
          }}
        />
      )}
    </div>
  );
}

/* =========================================================
   RECORD STAT
   ========================================================= */

function RecordStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="hp-card hp-card-hover p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
          {icon}
        </div>

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </div>

          <div className="mt-0.5 text-xl font-bold text-blue-950">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   RECORD ROW
   ========================================================= */

function RecordRow({
  record,
  menuOpen,
  onMenu,
  onOpen,
  onDelete,
  onRetry,
}: {
  record: MedicalRecord;
  menuOpen: boolean;
  onMenu: () => void;
  onOpen: () => void;
  onDelete: () => void;
  onRetry: () => void;
}) {
  const Icon =
    record.category === "Lab Report"
      ? FlaskConical
      : record.category === "Prescription"
        ? Pill
        : record.category === "Hospital"
          ? Hospital
          : Stethoscope;

  return (
    <div className="group relative flex items-center gap-3 px-5 py-4 transition hover:bg-slate-50/70 md:gap-4">
      <button
        onClick={onOpen}
        className="flex min-w-0 flex-1 items-center gap-3 text-left md:gap-4"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
          <Icon size={19} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold text-slate-800">
            {record.title}
          </div>

          <div className="mt-1 truncate text-[11px] text-slate-400">
            {record.provider} · {record.date}
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-semibold text-slate-500">
            {record.category}
          </span>
        </div>
      </button>

      <StatusBadge status={record.status} />

      {record.status === "READY" &&
        record.confidence && (
          <div className="hidden w-20 text-right lg:block">
            <div className="text-[9px] text-slate-400">
              AI confidence
            </div>

            <div className="mt-1 text-xs font-bold text-emerald-600">
              {record.confidence}%
            </div>
          </div>
        )}

      <div className="relative">
        <button
          onClick={onMenu}
          className="hp-icon-btn h-9 w-9 border-transparent bg-transparent"
        >
          <MoreVertical size={17} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-11 z-20 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
            <button
              onClick={onOpen}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
            >
              <FileText size={14} />
              View record
            </button>

            {record.status === "FAILED" && (
              <button
                onClick={onRetry}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-blue-600 hover:bg-blue-50"
              >
                <RefreshCw size={14} />
                Retry processing
              </button>
            )}

            <button
              onClick={onDelete}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   STATUS
   ========================================================= */

function StatusBadge({
  status,
}: {
  status: RecordStatus;
}) {
  if (status === "READY") {
    return (
      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[9px] font-bold text-emerald-600">
        <CheckCircle2 size={12} />
        <span className="hidden sm:inline">
          AI Analysed
        </span>
        <span className="sm:hidden">Ready</span>
      </span>
    );
  }

  if (status === "UPLOADING") {
    return (
      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1.5 text-[9px] font-bold text-blue-600">
        <Loader2
          size={12}
          className="animate-spin"
        />
        Uploading
      </span>
    );
  }

  if (status === "PROCESSING") {
    return (
      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1.5 text-[9px] font-bold text-violet-600">
        <Loader2
          size={12}
          className="animate-spin"
        />
        Processing
      </span>
    );
  }

  return (
    <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1.5 text-[9px] font-bold text-red-600">
      <AlertCircle size={12} />
      Failed
    </span>
  );
}

/* =========================================================
   UPLOAD MODAL
   ========================================================= */

function UploadModal({
  onClose,
  onUpload,
}: {
  onClose: () => void;
  onUpload: () => void;
}) {
  return (
    <Modal
      title="Add Medical Record"
      onClose={onClose}
    >
      <div className="space-y-5">
        <div className="rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/40 p-8 text-center transition hover:border-sky-400">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
            <Upload size={25} />
          </div>

          <h3 className="mt-4 font-bold text-slate-800">
            Upload a medical document
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
            Upload a PDF, JPG or PNG. HealthPassport will simulate
            classification, text extraction and AI structuring.
          </p>

          <button
            onClick={onUpload}
            className="hp-primary-btn mt-5"
          >
            <FileText size={16} />
            Use Sample Blood Report
          </button>

          <div className="mt-3 text-[10px] text-slate-400">
            Maximum file size: 20 MB
          </div>
        </div>

        <div>
          <div className="hp-label">
            Supported record types
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              "Lab Report",
              "Prescription",
              "Consultation",
              "Discharge Summary",
              "Imaging",
              "Vaccination",
              "Surgery",
              "Insurance",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 rounded-xl bg-blue-50 p-3">
          <ShieldCheck
            size={17}
            className="shrink-0 text-blue-600"
          />

          <p className="text-[10px] leading-4 text-blue-800">
            Your uploaded document is represented as a private
            health record in this POC.
          </p>
        </div>
      </div>
    </Modal>
  );
}

/* =========================================================
   PROCESSING MODAL
   ========================================================= */

function ProcessingModal() {
  const steps = [
    {
      label: "Document uploaded",
      done: true,
    },
    {
      label: "Extracting text",
      done: true,
    },
    {
      label: "Classifying document",
      done: true,
    },
    {
      label: "Extracting medical information",
      done: true,
    },
    {
      label: "Validating structured data",
      done: false,
    },
  ];

  return (
    <Modal title="AI Processing">
      <div className="py-2">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-50 text-violet-600">
          <Sparkles size={27} />
        </div>

        <div className="mt-5 text-center">
          <h3 className="font-bold text-slate-800">
            Understanding your document
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            HealthPassport AI is structuring the information.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.label}
              className="flex items-center gap-3"
            >
              {step.done ? (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={16} />
                </div>
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                  {index === 4 ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <Clock3 size={15} />
                  )}
                </div>
              )}

              <div className="flex-1">
                <div
                  className={`text-xs font-semibold ${
                    step.done
                      ? "text-slate-700"
                      : "text-violet-700"
                  }`}
                >
                  {step.label}
                </div>
              </div>

              {step.done && (
                <span className="text-[9px] font-medium text-emerald-600">
                  Complete
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-full bg-slate-100">
          <div className="hp-live h-1.5 w-[85%] rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
        </div>

        <div className="mt-2 text-center text-[10px] text-slate-400">
          AI processing in progress...
        </div>
      </div>
    </Modal>
  );
}

/* =========================================================
   RECORD DETAILS
   ========================================================= */

function RecordDetailsModal({
  record,
  onClose,
  onTimeline,
  onTrends,
}: {
  record: MedicalRecord;
  onClose: () => void;
  onTimeline: () => void;
  onTrends: () => void;
}) {
  return (
    <Modal
      title="Record Details"
      onClose={onClose}
      wide
    >
      <div className="space-y-5">
        {/* Record heading */}
        <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 p-5 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
            <FlaskConical size={25} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-lg font-bold text-blue-950">
              {record.title}
            </div>

            <div className="mt-1 text-xs text-slate-500">
              {record.provider} · {record.date}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-blue-600 shadow-sm">
              {record.category}
            </span>

            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-600">
              <CheckCircle2 size={12} />
              Ready
            </span>
          </div>
        </div>

        {/* AI confidence */}
        <div className="grid gap-3 sm:grid-cols-3">
          <DetailMetric
            label="AI Confidence"
            value={`${record.confidence ?? 97}%`}
          />

          <DetailMetric
            label="Document Type"
            value="Lab Report"
          />

          <DetailMetric
            label="Source"
            value="Uploaded Document"
          />
        </div>

        {/* Structured results */}
        <div className="hp-card overflow-hidden shadow-none">
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <div>
              <h3 className="font-bold text-slate-800">
                Structured Results
              </h3>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Information extracted from the source document
              </p>
            </div>

            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-600">
              Validated
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            <LabResult
              name="Hemoglobin"
              value="14.2"
              unit="g/dL"
              reference="13–17"
              status="Normal"
            />

            <LabResult
              name="HbA1c"
              value="6.8"
              unit="%"
              reference="< 5.7%"
              status="Above range"
              abnormal
            />

            <LabResult
              name="Fasting Glucose"
              value="118"
              unit="mg/dL"
              reference="70–100"
              status="Above range"
              abnormal
            />

            <LabResult
              name="Total Cholesterol"
              value="182"
              unit="mg/dL"
              reference="< 200"
              status="Normal"
            />
          </div>
        </div>

        {/* AI Summary */}
        <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-5">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
              <Sparkles size={18} />
            </div>

            <div>
              <h3 className="font-bold text-violet-950">
                AI Summary
              </h3>

              <p className="mt-2 text-sm leading-6 text-violet-900/80">
                The uploaded report contains routine blood test
                results. Hemoglobin is within the displayed reference
                range. HbA1c and fasting glucose are above the
                displayed reference ranges and can be compared with
                your previous results in Health Trends.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-white/70 p-3 text-[10px] leading-4 text-violet-800">
            AI-generated information is based on the source record
            and is not a diagnosis or medical advice.
          </div>
        </div>

        {/* Source traceability */}
        <div className="rounded-2xl border bg-slate-50 p-4">
          <div className="flex gap-3">
            <FileText
              size={18}
              className="mt-0.5 text-slate-500"
            />

            <div>
              <div className="text-xs font-bold text-slate-700">
                Source traceability
              </div>

              <p className="mt-1 text-[10px] leading-4 text-slate-500">
                Every structured result shown above is represented as
                being derived from this uploaded medical document.
              </p>

              <button className="mt-3 text-[10px] font-bold text-blue-600">
                View source document →
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            onClick={onTimeline}
            className="hp-secondary-btn"
          >
            <Clock3 size={16} />
            View in Timeline
          </button>

          <button
            onClick={onTrends}
            className="hp-primary-btn"
          >
            <FlaskConical size={16} />
            View Health Trends
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* =========================================================
   LAB RESULT
   ========================================================= */

function LabResult({
  name,
  value,
  unit,
  reference,
  status,
  abnormal = false,
}: {
  name: string;
  value: string;
  unit: string;
  reference: string;
  status: string;
  abnormal?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
      <div>
        <div className="text-[10px] text-slate-400">
          Test
        </div>

        <div className="mt-1 text-xs font-bold text-slate-800">
          {name}
        </div>
      </div>

      <div>
        <div className="text-[10px] text-slate-400">
          Result
        </div>

        <div className="mt-1 text-xs font-bold text-slate-800">
          {value} {unit}
        </div>
      </div>

      <div>
        <div className="text-[10px] text-slate-400">
          Reference
        </div>

        <div className="mt-1 text-xs font-medium text-slate-600">
          {reference}
        </div>
      </div>

      <div>
        <div className="text-[10px] text-slate-400">
          Status
        </div>

        <div
          className={`mt-1 text-xs font-bold ${
            abnormal
              ? "text-orange-600"
              : "text-emerald-600"
          }`}
        >
          {status}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DETAIL METRIC
   ========================================================= */

function DetailMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="text-[10px] text-slate-400">
        {label}
      </div>

      <div className="mt-1 text-sm font-bold text-slate-800">
        {value}
      </div>
    </div>
  );
}

/* =========================================================
   MODAL
   ========================================================= */

function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div
        className={`
          max-h-[92vh] w-full overflow-y-auto rounded-3xl
          border border-white/50 bg-white shadow-2xl
          ${wide ? "max-w-3xl" : "max-w-lg"}
        `}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur">
          <h2 className="font-bold text-blue-950">
            {title}
          </h2>

          {onClose && (
            <button
              onClick={onClose}
              className="hp-icon-btn h-9 w-9"
            >
              <X size={17} />
            </button>
          )}
        </div>

        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}