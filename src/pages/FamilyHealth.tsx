import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  AlertCircle,
    CalendarDays,
  Check,
  ChevronRight,
  
  FileText,
  Heart,
  
  Lock,
  Mail,
  
  MoreVertical,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";

interface FamilyHealthProps {
  onNavigate: (page: any) => void;
}

type FamilyMember = {
  id: number;
  name: string;
  relationship: string;
  age: number;
  dob: string;
  gender: string;
  initials: string;
  color: string;
  passportId: string;
  records: number;
  conditions: number;
  medications: number;
  bloodGroup: string;
  status: "Active" | "Needs setup";
  emergencyReady: boolean;
  email?: string;
  phone?: string;
};

const initialMembers: FamilyMember[] = [
  {
    id: 1,
    name: "Arjun Rao",
    relationship: "Self",
    age: 38,
    dob: "14 Feb 1988",
    gender: "Male",
    initials: "AR",
    color: "from-blue-500 to-cyan-500",
    passportId: "HP-2026-00128",
    records: 14,
    conditions: 3,
    medications: 3,
    bloodGroup: "O+",
    status: "Active",
    emergencyReady: true,
    email: "arjun.rao@example.com",
    phone: "+91 98XXXXXX21",
  },
  {
    id: 2,
    name: "Meera Rao",
    relationship: "Spouse",
    age: 35,
    dob: "22 Sep 1990",
    gender: "Female",
    initials: "MR",
    color: "from-violet-500 to-fuchsia-500",
    passportId: "HP-2026-00129",
    records: 9,
    conditions: 1,
    medications: 2,
    bloodGroup: "A+",
    status: "Active",
    emergencyReady: true,
    email: "meera.rao@example.com",
    phone: "+91 98XXXXXX45",
  },
  {
    id: 3,
    name: "Anaya Rao",
    relationship: "Daughter",
    age: 3,
    dob: "18 May 2023",
    gender: "Female",
    initials: "AN",
    color: "from-pink-500 to-rose-400",
    passportId: "HP-2026-00130",
    records: 6,
    conditions: 0,
    medications: 0,
    bloodGroup: "O+",
    status: "Active",
    emergencyReady: true,
  },
  {
    id: 4,
    name: "Ramesh Rao",
    relationship: "Parent",
    age: 67,
    dob: "09 Nov 1958",
    gender: "Male",
    initials: "RR",
    color: "from-emerald-500 to-teal-500",
    passportId: "HP-2026-00131",
    records: 18,
    conditions: 4,
    medications: 5,
    bloodGroup: "B+",
    status: "Active",
    emergencyReady: true,
  },
  {
    id: 5,
    name: "Family Member",
    relationship: "Dependent",
    age: 0,
    dob: "Not added",
    gender: "Not specified",
    initials: "?",
    color: "from-slate-400 to-slate-500",
    passportId: "",
    records: 0,
    conditions: 0,
    medications: 0,
    bloodGroup: "—",
    status: "Needs setup",
    emergencyReady: false,
  },
];

const recentFamilyActivity = [
  {
    id: 1,
    member: "Anaya Rao",
    action: "Vaccination record added",
    date: "02 Sep 2026",
    icon: ShieldCheck,
  },
  {
    id: 2,
    member: "Ramesh Rao",
    action: "Prescription updated",
    date: "30 Aug 2026",
    icon: FileText,
  },
  {
    id: 3,
    member: "Meera Rao",
    action: "Lab report analysed",
    date: "28 Aug 2026",
    icon: Activity,
  },
  {
    id: 4,
    member: "Arjun Rao",
    action: "Emergency Passport updated",
    date: "26 Aug 2026",
    icon: AlertCircle,
  },
];

export default function FamilyHealth({
  onNavigate,
}: FamilyHealthProps) {
  const [members, setMembers] =
    useState<FamilyMember[]>(initialMembers);

  const [selectedId, setSelectedId] = useState(1);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfile, setShowProfile] =
    useState<FamilyMember | null>(null);
  const [showPermissions, setShowPermissions] =
    useState<FamilyMember | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [newName, setNewName] = useState("");
  const [newRelationship, setNewRelationship] =
    useState("Child");
  const [newDob, setNewDob] = useState("");
  const [newGender, setNewGender] =
    useState("Female");

  const selectedMember =
    members.find((member) => member.id === selectedId) ??
    members[0];

  const filteredMembers = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return members;

    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(query) ||
        member.relationship.toLowerCase().includes(query)
    );
  }, [members, search]);

  const activeMembers = members.filter(
    (member) => member.status === "Active"
  );

  const totalRecords = members.reduce(
    (total, member) => total + member.records,
    0
  );

  const createFamilyMember = () => {
    if (!newName.trim()) return;

    const newMember: FamilyMember = {
      id: Date.now(),
      name: newName.trim(),
      relationship: newRelationship,
      age: calculateAge(newDob),
      dob: newDob
        ? formatDate(newDob)
        : "Not added",
      gender: newGender,
      initials: getInitials(newName),
      color: getFamilyColor(members.length),
      passportId: `HP-2026-${String(
        132 + members.length
      ).padStart(5, "0")}`,
      records: 0,
      conditions: 0,
      medications: 0,
      bloodGroup: "—",
      status: "Needs setup",
      emergencyReady: false,
    };

    setMembers((current) => [...current, newMember]);
    setSelectedId(newMember.id);
    setShowAddModal(false);

    setNewName("");
    setNewRelationship("Child");
    setNewDob("");
    setNewGender("Female");

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 3500);
  };

  const removeMember = (id: number) => {
    const member = members.find((item) => item.id === id);

    if (!member || member.relationship === "Self") {
      return;
    }

    setMembers((current) =>
      current.filter((item) => item.id !== id)
    );

    if (selectedId === id) {
      setSelectedId(1);
    }

    setShowProfile(null);
    setShowPermissions(null);
  };

  return (
    <div className="min-h-full w-full bg-[#f6f8fb]">
      <div className="mx-auto w-full max-w-[1500px] space-y-6 p-4 sm:p-6 lg:p-8">

        {/* =====================================================
            HEADER
            ===================================================== */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-100/40 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                <Users size={16} />
                Family health management
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950">
                Family Health
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage health passports for your family, children and
                dependants while keeping each person's health information
                separate and controlled.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              <Plus size={17} />
              Add Family Member
            </button>
          </div>
        </section>

        {/* =====================================================
            FAMILY PRIVACY BANNER
            ===================================================== */}
        <section className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-violet-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
              <Lock size={18} />
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-900">
                Separate passports. One family view.
              </h3>

              <p className="mt-1 max-w-4xl text-xs leading-5 text-slate-600">
                Each family member has an independent HealthPassport.
                You can switch between profiles and manage authorised
                caregiver access without combining everyone's medical
                records.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            STATS
            ===================================================== */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<Users size={18} />}
            label="Family members"
            value={String(activeMembers.length)}
            description="Active family passports"
          />

          <StatCard
            icon={<FileText size={18} />}
            label="Health records"
            value={String(totalRecords)}
            description="Across family passports"
          />

          <StatCard
            icon={<ShieldCheck size={18} />}
            label="Emergency ready"
            value={`${members.filter((m) => m.emergencyReady).length}`}
            description="Emergency profiles active"
          />

          <StatCard
            icon={<Heart size={18} />}
            label="Family coverage"
            value="100%"
            description="Profiles under your view"
          />
        </div>

        {/* =====================================================
            FAMILY MEMBERS
            ===================================================== */}
        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Your family
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-950">
                Family passports
              </h2>
            </div>

            <div className="relative w-full sm:w-64">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search family..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none transition focus:border-blue-300"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredMembers.map((member) => {
              const isSelected =
                selectedMember.id === member.id;

              return (
                <FamilyMemberCard
                  key={member.id}
                  member={member}
                  selected={isSelected}
                  onSelect={() => {
                    setSelectedId(member.id);
                  }}
                  onOpen={() => setShowProfile(member)}
                  onPermissions={() =>
                    setShowPermissions(member)
                  }
                />
              );
            })}
          </div>
        </section>

        {/* =====================================================
            SELECTED MEMBER HEALTH SNAPSHOT
            ===================================================== */}
        {selectedMember && (
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-r from-white to-blue-50/60 p-5 lg:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${selectedMember.color} text-sm font-black text-white shadow-lg`}
                  >
                    {selectedMember.initials}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black text-slate-950">
                        {selectedMember.name}
                      </h2>

                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-700">
                        {selectedMember.relationship}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {selectedMember.passportId ||
                        "Passport setup required"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      setShowProfile(selectedMember)
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50"
                  >
                    <UserRound size={14} />
                    View Passport
                  </button>

                  <button
                    onClick={() =>
                      onNavigate("records")
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-black text-white hover:bg-slate-800"
                  >
                    <FileText size={14} />
                    View Records
                  </button>
                </div>
              </div>
            </div>

            <div className="grid divide-y divide-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
              <SnapshotItem
                icon={<FileText size={18} />}
                label="Medical records"
                value={String(selectedMember.records)}
                description="Uploaded records"
              />

              <SnapshotItem
                icon={<Activity size={18} />}
                label="Conditions"
                value={String(selectedMember.conditions)}
                description="Tracked conditions"
              />

              <SnapshotItem
                icon={<Heart size={18} />}
                label="Medications"
                value={String(selectedMember.medications)}
                description="Current medications"
              />

              <SnapshotItem
                icon={<ShieldCheck size={18} />}
                label="Blood group"
                value={selectedMember.bloodGroup}
                description={
                  selectedMember.emergencyReady
                    ? "Emergency profile ready"
                    : "Needs setup"
                }
              />
            </div>
          </section>
        )}

        {/* =====================================================
            FAMILY ACTIVITY + CAREGIVER ACCESS
            ===================================================== */}
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <div className="flex items-center gap-2">
                <Activity
                  size={18}
                  className="text-blue-600"
                />

                <h2 className="text-lg font-black text-slate-950">
                  Recent family activity
                </h2>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Recent health activity across the family.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {recentFamilyActivity.map((activity) => {
                const Icon = activity.icon;

                return (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                      <Icon size={17} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-slate-900">
                        {activity.action}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-500">
                        {activity.member}
                      </p>
                    </div>

                    <span className="shrink-0 text-[10px] font-semibold text-slate-400">
                      {activity.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Users size={18} />
            </div>

            <h2 className="mt-4 text-lg font-black text-slate-950">
              Caregiver access
            </h2>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Family management can allow authorised caregivers to
              help manage another person's passport without giving
              them unrestricted access.
            </p>

            <div className="mt-5 space-y-3">
              <AccessRow
                title="Parent / dependent access"
                description="Manage health information"
              />

              <AccessRow
                title="Emergency information"
                description="Access critical emergency profile"
              />

              <AccessRow
                title="Medical records"
                description="View authorised records only"
              />
            </div>

            <button
              onClick={() =>
                setShowPermissions(selectedMember)
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-black text-slate-700 hover:bg-slate-50"
            >
              Manage permissions
              <ChevronRight size={14} />
            </button>
          </section>
        </div>

        {/* =====================================================
            EMERGENCY SHORTCUT
            ===================================================== */}
        <section className="rounded-3xl border border-red-100 bg-gradient-to-r from-red-50 to-orange-50 p-5 lg:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
                <AlertCircle size={19} />
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Family emergency passports
                </h3>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-600">
                  Emergency information can be maintained separately
                  for each family member and made available without
                  exposing their complete medical record.
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                onNavigate("emergency")
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-xs font-black text-white hover:bg-red-700"
            >
              Open Emergency Passport
              <ChevronRight size={14} />
            </button>
          </div>
        </section>
      </div>

      {/* =======================================================
          ADD FAMILY MEMBER MODAL
          ======================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <div>
                <div className="flex items-center gap-2">
                  <Users
                    size={19}
                    className="text-blue-600"
                  />

                  <h2 className="text-lg font-black text-slate-950">
                    Add family member
                  </h2>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Create a separate HealthPassport for a family
                  member.
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X size={17} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                  Full name
                </label>

                <div className="relative">
                  <UserRound
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={newName}
                    onChange={(event) =>
                      setNewName(event.target.value)
                    }
                    placeholder="Family member name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-3 text-sm outline-none focus:border-blue-300 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                    Relationship
                  </label>

                  <select
                    value={newRelationship}
                    onChange={(event) =>
                      setNewRelationship(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-blue-300 focus:bg-white"
                  >
                    <option>Child</option>
                    <option>Spouse</option>
                    <option>Parent</option>
                    <option>Sibling</option>
                    <option>Grandparent</option>
                    <option>Dependent</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                    Gender
                  </label>

                  <select
                    value={newGender}
                    onChange={(event) =>
                      setNewGender(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-blue-300 focus:bg-white"
                  >
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                  Date of birth
                </label>

                <div className="relative">
                  <CalendarDays
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    value={newDob}
                    onChange={(event) =>
                      setNewDob(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-3 text-sm outline-none focus:border-blue-300 focus:bg-white"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex gap-3">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-600"
                  />

                  <div>
                    <p className="text-xs font-black text-blue-900">
                      Privacy by default
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-blue-800">
                      A new family member starts with their own
                      separate passport. You can configure caregiver
                      permissions after creation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={createFamilyMember}
                  disabled={!newName.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus size={15} />
                  Create family passport
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          MEMBER PROFILE MODAL
          ======================================================= */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="border-b border-slate-100 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${showProfile.color} text-sm font-black text-white`}
                  >
                    {showProfile.initials}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black text-slate-950">
                        {showProfile.name}
                      </h2>

                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-700">
                        {showProfile.relationship}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {showProfile.passportId ||
                        "Passport setup required"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowProfile(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoBox
                  icon={<CalendarDays size={16} />}
                  label="Date of birth"
                  value={showProfile.dob}
                />

                <InfoBox
                  icon={<UserRound size={16} />}
                  label="Gender"
                  value={showProfile.gender}
                />

                <InfoBox
                  icon={<Heart size={16} />}
                  label="Blood group"
                  value={showProfile.bloodGroup}
                />

                <InfoBox
                  icon={<ShieldCheck size={16} />}
                  label="Emergency profile"
                  value={
                    showProfile.emergencyReady
                      ? "Active"
                      : "Needs setup"
                  }
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Health summary
                </p>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <MiniMetric
                    label="Records"
                    value={String(showProfile.records)}
                  />

                  <MiniMetric
                    label="Conditions"
                    value={String(
                      showProfile.conditions
                    )}
                  />

                  <MiniMetric
                    label="Medications"
                    value={String(
                      showProfile.medications
                    )}
                  />
                </div>
              </div>

              {(showProfile.email ||
                showProfile.phone) && (
                <div>
                  <p className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">
                    Contact
                  </p>

                  <div className="space-y-2">
                    {showProfile.email && (
                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                        <Mail
                          size={15}
                          className="text-slate-400"
                        />

                        <span className="text-xs font-semibold text-slate-700">
                          {showProfile.email}
                        </span>
                      </div>
                    )}

                    {showProfile.phone && (
                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                        <Phone
                          size={15}
                          className="text-slate-400"
                        />

                        <span className="text-xs font-semibold text-slate-700">
                          {showProfile.phone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
                <button
                  onClick={() => {
                    setSelectedId(showProfile.id);
                    setShowProfile(null);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-black text-white hover:bg-blue-700"
                >
                  <Check size={15} />
                  Switch to this passport
                </button>

                {showProfile.relationship !==
                  "Self" && (
                  <button
                    onClick={() =>
                      removeMember(showProfile.id)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-black text-red-700 hover:bg-red-100"
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          PERMISSIONS MODAL
          ======================================================= */}
      {showPermissions && (
        <PermissionsModal
          member={showPermissions}
          onClose={() => setShowPermissions(null)}
        />
      )}

      {/* =======================================================
          SUCCESS TOAST
          ======================================================= */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 z-[60] w-[calc(100%-3rem)] max-w-sm rounded-2xl border border-emerald-200 bg-white p-4 shadow-2xl">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Check size={18} />
            </div>

            <div>
              <p className="text-xs font-black text-slate-900">
                Family passport created
              </p>

              <p className="mt-1 text-[11px] leading-4 text-slate-500">
                The new family member has been added to your family
                health view.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   FAMILY MEMBER CARD
   ========================================================= */

function FamilyMemberCard({
  member,
  selected,
  onSelect,
  onOpen,
  onPermissions,
}: {
  member: FamilyMember;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onPermissions: () => void;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        selected
          ? "border-blue-300 ring-2 ring-blue-50"
          : "border-slate-200"
      }`}
    >
      <button
        onClick={onSelect}
        className="absolute inset-0 z-0"
        aria-label={`Select ${member.name}`}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${member.color} text-xs font-black text-white shadow-md`}
          >
            {member.initials}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900">
                {member.name}
              </h3>

              {member.relationship === "Self" && (
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-black text-blue-700">
                  YOU
                </span>
              )}
            </div>

            <p className="mt-1 text-[11px] text-slate-500">
              {member.relationship} ·{" "}
              {member.age > 0
                ? `${member.age} years`
                : "Age not added"}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={(event) => {
              event.stopPropagation();
              onOpen();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <div className="relative z-10 mt-5 grid grid-cols-3 gap-2">
        <SmallStat
          label="Records"
          value={String(member.records)}
        />

        <SmallStat
          label="Conditions"
          value={String(member.conditions)}
        />

        <SmallStat
          label="Meds"
          value={String(member.medications)}
        />
      </div>

      <div className="relative z-10 mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-1.5">
          <span
            className={`h-2 w-2 rounded-full ${
              member.status === "Active"
                ? "bg-emerald-500"
                : "bg-amber-500"
            }`}
          />

          <span className="text-[10px] font-bold text-slate-500">
            {member.status}
          </span>
        </div>

        <button
          onClick={(event) => {
            event.stopPropagation();
            onPermissions();
          }}
          className="text-[10px] font-black text-blue-600 hover:text-blue-700"
        >
          Permissions
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   PERMISSIONS MODAL
   ========================================================= */

function PermissionsModal({
  member,
  onClose,
}: {
  member: FamilyMember;
  onClose: () => void;
}) {
  const [permissions, setPermissions] = useState({
    health: true,
    emergency: true,
    records: true,
    sharing: false,
  });

  const toggle = (key: keyof typeof permissions) => {
    setPermissions((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 p-6">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck
                size={19}
                className="text-blue-600"
              />

              <h2 className="text-lg font-black text-slate-950">
                Family permissions
              </h2>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Control what can be managed for {member.name}.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            <X size={17} />
          </button>
        </div>

        <div className="space-y-3 p-6">
          <PermissionRow
            title="Health overview"
            description="Conditions, medications and health snapshot"
            enabled={permissions.health}
            onToggle={() => toggle("health")}
          />

          <PermissionRow
            title="Emergency information"
            description="Emergency profile and critical information"
            enabled={permissions.emergency}
            onToggle={() => toggle("emergency")}
          />

          <PermissionRow
            title="Medical records"
            description="View authorised medical documents"
            enabled={permissions.records}
            onToggle={() => toggle("records")}
          />

          <PermissionRow
            title="Manage sharing"
            description="Create or revoke sharing permissions"
            enabled={permissions.sharing}
            onToggle={() => toggle("sharing")}
          />

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex gap-3">
              <Lock
                size={17}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <p className="text-[11px] leading-5 text-blue-800">
                Permissions are scoped to this family member's
                passport. They do not grant access to other family
                members.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-3 w-full rounded-xl bg-slate-950 px-4 py-3 text-xs font-black text-white hover:bg-slate-800"
          >
            Save permissions
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   REUSABLE UI
   ========================================================= */

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-700">
        {icon}
      </div>

      <p className="mt-4 text-2xl font-black tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-xs font-bold text-slate-700">
        {label}
      </p>

      <p className="mt-1 text-[11px] text-slate-400">
        {description}
      </p>
    </div>
  );
}

function SnapshotItem({
  icon,
  label,
  value,
  description,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
          {icon}
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-1 text-xl font-black text-slate-900">
            {value}
          </p>
        </div>
      </div>

      <p className="mt-3 text-[10px] text-slate-400">
        {description}
      </p>
    </div>
  );
}

function SmallStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-2.5">
      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-slate-800">
        {value}
      </p>
    </div>
  );
}

function AccessRow({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600">
        <Check size={14} strokeWidth={3} />
      </div>

      <div>
        <p className="text-[11px] font-black text-slate-800">
          {title}
        </p>

        <p className="mt-0.5 text-[10px] text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-500">
        {icon}
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-xs font-black text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white p-3 text-center">
      <p className="text-lg font-black text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
    </div>
  );
}

function PermissionRow({
  title,
  description,
  enabled,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4">
      <div>
        <p className="text-xs font-black text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-[10px] leading-4 text-slate-500">
          {description}
        </p>
      </div>

      <button
        onClick={onToggle}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

/* =========================================================
   HELPERS
   ========================================================= */

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function calculateAge(dateString: string) {
  if (!dateString) return 0;

  const birthDate = new Date(dateString);
  const today = new Date();

  let age =
    today.getFullYear() - birthDate.getFullYear();

  const monthDifference =
    today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return Math.max(age, 0);
}

function formatDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getFamilyColor(index: number) {
  const colors = [
    "from-blue-500 to-cyan-500",
    "from-violet-500 to-fuchsia-500",
    "from-pink-500 to-rose-400",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-amber-400",
    "from-indigo-500 to-blue-500",
  ];

  return colors[index % colors.length];
}