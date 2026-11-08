// src/Components/Profile/AccountSettings.jsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../Context/AuthContext";
import { useToast } from "../../Context/ToastContext";

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="settings-toggle-row">
      <div>
        <strong>{label}</strong>
        <p className="text-muted mb-0 small">{description}</p>
      </div>
      <div className="form-check form-switch m-0">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          aria-label={label}
          checked={checked}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

function AccountSettings() {
  const { user, updateUser, deleteUser, logout, registeredUsers } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [openPanel, setOpenPanel] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const notifications = {
    emailBookings: true,
    emailReminders: true,
    emailPromotions: false,
    ...user?.notifications,
  };

  const privacy = {
    showReviews: true,
    shareWishlist: false,
    ...user?.privacy,
  };

  // Demo accounts come from mockUsers, not the registered list
  const isDemoAccount = !registeredUsers.some((u) => u.id === user?.id);

  const togglePanel = (name) => {
    setOpenPanel((prev) => (prev === name ? null : name));
  };

  const toggleSetting = (group, key) => {
    const current = group === "notifications" ? notifications : privacy;
    updateUser({ [group]: { ...current, [key]: !current[key] } });
    showToast("Preferences saved", "success");
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (passwordForm.current !== user.password) {
      showToast("Current password is incorrect", "danger");
      return;
    }
    if (passwordForm.next.length < 8) {
      showToast("New password must be at least 8 characters", "danger");
      return;
    }
    if (passwordForm.next === passwordForm.current) {
      showToast("New password must be different", "danger");
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      showToast("Passwords do not match", "danger");
      return;
    }

    updateUser({ password: passwordForm.next });
    setPasswordForm({ current: "", next: "", confirm: "" });
    setOpenPanel(null);
    showToast("Password changed", "success");
  };

  const handleDelete = () => {
    if (deleteConfirm !== "DELETE") return;

    if (isDemoAccount) {
      showToast("Demo accounts can't be deleted", "danger");
      return;
    }

    deleteUser(user.id);
    logout();
    navigate("/");
  };

  return (
    <div className="settings-card">
      <h3 className="mb-1">Account Settings</h3>
      <p className="text-muted mb-4">
        Manage your account preferences and security settings.
      </p>

      {/* Change password */}
      <div className="settings-item">
        <div className="settings-info">
          <strong>Change password</strong>
          <p className="text-muted mb-0">
            Update your password to keep your account secure
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => togglePanel("password")}
        >
          {openPanel === "password" ? "Cancel" : "Change"}
        </button>
      </div>

      {openPanel === "password" && (
        <form className="settings-panel" onSubmit={handlePasswordChange}>
          {isDemoAccount && (
            <div className="alert alert-warning small mb-0">
              Demo accounts go back to their original password when you log in again.
            </div>
          )}
          <input
            type="password"
            className="form-control"
            placeholder="Current password"
            value={passwordForm.current}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, current: e.target.value })
            }
            required
          />
          <input
            type="password"
            className="form-control"
            placeholder="New password (min 8 characters)"
            value={passwordForm.next}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, next: e.target.value })
            }
            required
          />
          <input
            type="password"
            className="form-control"
            placeholder="Confirm new password"
            value={passwordForm.confirm}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, confirm: e.target.value })
            }
            required
          />
          <button type="submit" className="btn btn-primary align-self-start">
            Update password
          </button>
        </form>
      )}

      {/* Email notifications */}
      <div className="settings-item">
        <div className="settings-info">
          <strong>Email notifications</strong>
          <p className="text-muted mb-0">
            Manage your email notification preferences
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => togglePanel("notifications")}
        >
          {openPanel === "notifications" ? "Close" : "Configure"}
        </button>
      </div>

      {openPanel === "notifications" && (
        <div className="settings-panel">
          <ToggleRow
            label="Booking confirmations"
            description="Receive an email when you book tickets"
            checked={notifications.emailBookings}
            onChange={() => toggleSetting("notifications", "emailBookings")}
          />
          <ToggleRow
            label="Event reminders"
            description="Receive a reminder before your events"
            checked={notifications.emailReminders}
            onChange={() => toggleSetting("notifications", "emailReminders")}
          />
          <ToggleRow
            label="Offers and promotions"
            description="Receive news about discounts and new events"
            checked={notifications.emailPromotions}
            onChange={() => toggleSetting("notifications", "emailPromotions")}
          />
        </div>
      )}

      {/* Privacy */}
      <div className="settings-item">
        <div className="settings-info">
          <strong>Privacy settings</strong>
          <p className="text-muted mb-0">
            Control your privacy and data settings
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => togglePanel("privacy")}
        >
          {openPanel === "privacy" ? "Close" : "Manage"}
        </button>
      </div>

      {openPanel === "privacy" && (
        <div className="settings-panel">
          <ToggleRow
            label="Show my name on reviews"
            description="Other users can see your name on the reviews you write"
            checked={privacy.showReviews}
            onChange={() => toggleSetting("privacy", "showReviews")}
          />
          <ToggleRow
            label="Share my wishlist"
            description="Let others see the events you have saved"
            checked={privacy.shareWishlist}
            onChange={() => toggleSetting("privacy", "shareWishlist")}
          />
        </div>
      )}

      {/* Delete account */}
      <div className="settings-item danger">
        <div className="settings-info">
          <strong>Delete account</strong>
          <p className="text-muted mb-0">
            Permanently delete your account and all data
          </p>
        </div>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => togglePanel("delete")}
        >
          {openPanel === "delete" ? "Cancel" : "Delete"}
        </button>
      </div>

      {openPanel === "delete" && (
        <div className="settings-panel">
          <p className="mb-0">
            This cannot be undone. Type <strong>DELETE</strong> to confirm.
          </p>
          <input
            type="text"
            className="form-control"
            placeholder="Type DELETE"
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-danger align-self-start"
            onClick={handleDelete}
            disabled={deleteConfirm !== "DELETE"}
          >
            Permanently delete my account
          </button>
        </div>
      )}
    </div>
  );
}

export default AccountSettings;