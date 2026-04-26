"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { ProgressChart, ProgressPoint } from "@/components/ProgressChart";
import { EXPERIENCE_LEVEL_LABELS, ExperienceLevelValue } from "@/lib/experience-level";

type UserStatus = "PENDING" | "APPROVED" | "REJECTED";

type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: UserStatus;
  experienceLevel: ExperienceLevelValue;
  createdAt: string;
  progressCount: number;
};

type StatusFilter = "pending" | "approved" | "rejected" | "all";

const STATUS_FILTER_LABELS: Record<StatusFilter, string> = {
  pending: "قيد الانتظار",
  approved: "المستخدمون الحاليون",
  rejected: "مرفوض",
  all: "الكل"
};

const USER_STATUS_LABELS: Record<UserStatus, string> = {
  PENDING: "قيد الانتظار",
  APPROVED: "معتمد",
  REJECTED: "مرفوض"
};

export function AdminDashboard() {
  const router = useRouter();
  const [status, setStatus] = useState<StatusFilter>("approved");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [loadingProgressFor, setLoadingProgressFor] = useState<string | null>(null);
  const [progressByUser, setProgressByUser] = useState<Record<string, ProgressPoint[]>>({});

  async function loadUsers(filter: StatusFilter) {
    setLoading(true);
    try {
      const query = filter === "all" ? "" : `?status=${filter}`;
      const response = await fetch(`/api/admin/users${query}`);
      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error ?? "فشل تحميل المستخدمين.");
        return;
      }

      setUsers(result.users);
      setPendingCount(result.counts?.pending ?? 0);
    } catch {
      toast.error("حدث خطأ غير متوقع في الشبكة.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setExpandedUserId(null);
    void loadUsers(status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function approve(id: string) {
    const response = await fetch(`/api/admin/users/${id}/approve`, { method: "POST" });
    const result = await response.json();

    if (!response.ok) {
      toast.error(result.error ?? "فشل اعتماد المستخدم.");
      return;
    }

    toast.success(
      `تم الاعتماد. البريد: ${result.credentials.email} | كلمة المرور: ${result.credentials.password}`
    );

    if (!result.emailSent) {
      toast("خدمة البريد غير مهيأة حالياً، لذلك لم يتم إرسال بيانات الدخول عبر البريد.");
    }

    void loadUsers(status);
  }

  async function reject(id: string) {
    const response = await fetch(`/api/admin/users/${id}/reject`, { method: "POST" });
    const result = await response.json();

    if (!response.ok) {
      toast.error(result.error ?? "فشل رفض المستخدم.");
      return;
    }

    toast.success("تم رفض المستخدم.");
    void loadUsers(status);
  }

  async function toggleProgressAccordion(id: string) {
    const selectedUser = users.find((user) => user.id === id);

    if (!selectedUser || selectedUser.status !== "APPROVED") {
      toast.error("المتابعة متاحة فقط للمستخدمين المعتمدين.");
      return;
    }

    if (expandedUserId === id) {
      setExpandedUserId(null);
      return;
    }

    setExpandedUserId(id);

    if (progressByUser[id]) {
      return;
    }

    setLoadingProgressFor(id);

    try {
      const response = await fetch(`/api/admin/users/${id}/progress`);
      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error ?? "فشل تحميل سجل المتابعة.");
        setExpandedUserId(null);
        return;
      }

      setProgressByUser((current) => ({ ...current, [id]: result.user.progress }));
    } catch {
      toast.error("حدث خطأ غير متوقع في الشبكة.");
      setExpandedUserId(null);
    } finally {
      setLoadingProgressFor((current) => (current === id ? null : current));
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="space-y-5 m-20">
      <section className="panel flex items-center justify-between p-5">
        <div>
          <h1 className="text-2xl font-semibold text-brand-amber">لوحة تحكم الإدارة</h1>
          <p className="text-sm text-slate-300">مراجعة طلبات التسجيل ومتابعة أداء المتداولين.</p>
        </div>
        <button className="button-ghost" onClick={logout}>
          تسجيل الخروج
        </button>
      </section>

      <section className="panel p-3">
        <div className="border-b border-brand-silver/20 pb-3">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="فلاتر حالة المستخدمين">
            {(["approved", "pending", "rejected", "all"] as StatusFilter[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStatus(item)}
                className={`relative tab-button ${status === item ? "tab-button-active" : ""}`}
                role="tab"
                aria-selected={status === item}
              >
                {item === "pending" && (
                  <span className="absolute -left-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white shadow">
                    {pendingCount}
                  </span>
                )}
                {STATUS_FILTER_LABELS[item]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 overflow-x-auto">
          {loading ? (
            <p className="p-4 text-slate-300">جاري تحميل المستخدمين...</p>
          ) : users.length === 0 ? (
            <p className="p-4 text-slate-300">لا يوجد مستخدمون بهذه الحالة.</p>
          ) : (
            <table className="table min-w-[900px] text-sm">
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>البريد الإلكتروني</th>
                  <th>الحالة</th>
                  <th>الخبرة</th>
                  <th>عدد السجلات</th>
                  <th>تاريخ الإنشاء</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isExpanded = expandedUserId === user.id;
                  const isLoadingProgress = loadingProgressFor === user.id;
                  const progressRows = (progressByUser[user.id] ?? []).slice().reverse();

                  return (
                    <Fragment key={user.id}>
                      <tr>
                        <td>
                          {user.firstName} {user.lastName}
                        </td>
                        <td>{user.email}</td>
                        <td>{USER_STATUS_LABELS[user.status]}</td>
                        <td>{EXPERIENCE_LEVEL_LABELS[user.experienceLevel]}</td>
                        <td>{user.progressCount}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString("ar-JO")}</td>
                        <td className="space-x-2">
                          {user.status === "PENDING" && (
                            <>
                              <button className="button-primary" onClick={() => approve(user.id)} type="button">
                                اعتماد
                              </button>
                              <button className="button-ghost" onClick={() => reject(user.id)} type="button">
                                رفض
                              </button>
                            </>
                          )}
                          {user.status === "APPROVED" ? (
                            <button
                              className="button-ghost"
                              onClick={() => toggleProgressAccordion(user.id)}
                              type="button"
                            >
                              {isExpanded ? "إخفاء المتابعة" : "عرض المتابعة"}
                            </button>
                          ) : (
                            <span className="text-xs text-slate-500">متاح بعد الاعتماد</span>
                          )}
                        </td>
                      </tr>

                      {user.status === "APPROVED" && isExpanded && (
                        <tr>
                          <td colSpan={7} className="bg-brand-smoke/35">
                            <div className="space-y-3 p-3">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-brand-amber">
                                  سجل المتابعة الكامل - {user.firstName} {user.lastName}
                                </h3>
                                <span className="text-xs text-slate-300">{progressRows.length} سجل</span>
                              </div>

                              {isLoadingProgress ? (
                                <p className="text-sm text-slate-300">جاري تحميل المتابعة...</p>
                              ) : (
                                <div className="space-y-3">
                                  <ProgressChart data={progressByUser[user.id] ?? []} />
                                  <div className="overflow-x-auto rounded-md border border-brand-silver/20">
                                    <table className="table min-w-[380px] text-xs">
                                      <thead>
                                        <tr>
                                          <th>التاريخ</th>
                                          <th>النتيجة</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {progressRows.length === 0 ? (
                                          <tr>
                                            <td colSpan={2} className="text-slate-300">
                                              لا توجد سجلات متابعة حتى الآن.
                                            </td>
                                          </tr>
                                        ) : (
                                          progressRows.map((entry) => (
                                            <tr key={entry.entryDate}>
                                              <td>{entry.entryDate}</td>
                                              <td>{entry.revenue.toFixed(2)}$</td>
                                            </tr>
                                          ))
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
