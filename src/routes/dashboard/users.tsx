import { useState, useEffect, useCallback } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { DashboardLayout, DeleteConfirmDialog } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getUsers, createUser, updateUser, deleteUser } from "@/lib/api";
import { authStore } from "@/stores/auth";
import { FeedbackModal } from "@/components/ui/feedback-modal";
import { Plus, Pencil, Trash2, Loader2, AlertCircle } from "lucide-react";
import type { UserRecord, CreateUserInput, UpdateUserInput, UserRole } from "@/types/user";

export const Route = createFileRoute("/dashboard/users")({
  beforeLoad: () => {
    const user = authStore.getSnapshot().user;
    if (user?.role !== "admin") {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: UsersPage,
});

function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CreateUserInput>({
    username: "",
    password: "",
    role: "user",
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Feedback modal state
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers({ page, limit: 10 });
      setUsers(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreate = () => {
    setSelectedUser(null);
    setFormData({ username: "", password: "", role: "user" });
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user: UserRecord) => {
    setSelectedUser(user);
    setFormData({ username: user.username, password: "", role: user.role });
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (user: UserRecord) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      if (selectedUser) {
        const updateData: UpdateUserInput = {
          username: formData.username,
          role: formData.role,
        };
        if (formData.password) {
          if (formData.password.length < 8) {
            setFormError("Password must be at least 8 characters");
            setIsSubmitting(false);
            return;
          }
          updateData.password = formData.password;
        }
        await updateUser(selectedUser.id, updateData);
        setFeedback({
          type: "success",
          title: "User Updated",
          message: `User "${formData.username}" has been updated successfully.`,
        });
      } else {
        if (!formData.password) {
          setFormError("Password is required for new users");
          setIsSubmitting(false);
          return;
        }
        if (formData.password.length < 8) {
          setFormError("Password must be at least 8 characters");
          setIsSubmitting(false);
          return;
        }
        await createUser(formData);
        setFeedback({
          type: "success",
          title: "User Created",
          message: `User "${formData.username}" has been created successfully.`,
        });
      }
      setIsFormOpen(false);
      fetchUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save user";
      setFeedback({
        type: "error",
        title: selectedUser ? "Update Failed" : "Creation Failed",
        message,
      });
      setIsFormOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    const username = selectedUser.username;

    try {
      await deleteUser(selectedUser.id);
      setIsDeleteOpen(false);
      setSelectedUser(null);
      setFeedback({
        type: "success",
        title: "User Deleted",
        message: `User "${username}" has been deleted successfully.`,
      });
      fetchUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete user";
      setIsDeleteOpen(false);
      setFeedback({
        type: "error",
        title: "Delete Failed",
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Users">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
            <p className="text-sm text-gray-500">Manage system users and their roles</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Table */}
        <div className="rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Username
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Created
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {user.username}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
              <p className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? "Edit User" : "Create User"}
            </DialogTitle>
            <DialogDescription>
              {selectedUser
                ? "Update user details. Leave password blank to keep current."
                : "Add a new user to the system."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {formError && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {formError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, username: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password {selectedUser && "(leave blank to keep current)"}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                required={!selectedUser}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) =>
                  setFormData((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {selectedUser ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          setIsDeleteOpen(open);
          if (!open) setSelectedUser(null);
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={isSubmitting}
        title="Delete User"
        description={`Are you sure you want to delete user "${selectedUser?.username}"? This action cannot be undone.`}
      />

      {/* Feedback Modal */}
      {feedback && (
        <FeedbackModal
          open={!!feedback}
          onClose={() => setFeedback(null)}
          type={feedback.type}
          title={feedback.title}
          message={feedback.message}
        />
      )}
    </DashboardLayout>
  );
}
