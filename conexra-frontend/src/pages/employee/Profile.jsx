import { useState, useEffect } from "react";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaBriefcase,
  FaCalendarAlt,
  FaBuilding,
  FaEdit,
  FaSave,
  FaTimes,
  FaKey,
  FaCamera,
  FaCheckCircle
} from "react-icons/fa";
import { getCurrentProfile, updateCurrentProfile, changePassword } from "../../services/employeeService";

function MyProfile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    department: "",
    position: "",
    employeeId: "",
    joinDate: ""
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [passwordError, setPasswordError] = useState("");

  // Load user data from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await getCurrentProfile();
        const currentUser = data.user || JSON.parse(localStorage.getItem("user") || "{}");
        const employee = data.employee || {};
        setUser(currentUser);
        setProfileForm({
          name: currentUser.name || "John Doe",
          email: currentUser.email || "john@conexra.com",
          phone: employee.phone || "",
          address: employee.address || "",
          city: employee.city || "",
          country: employee.country || "",
          department: employee.department || "",
          position: employee.position || "",
          employeeId: employee._id ? `EMP${employee._id.toString().slice(-6).toUpperCase()}` : "",
          joinDate: employee.dateOfJoining ? new Date(employee.dateOfJoining).toISOString().split('T')[0] : ""
        });
      } catch (err) {
        console.error(err);
        setProfileError(err?.response?.data?.error || "Unable to load profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setProfileError("");

    try {
      const payload = {
        name: profileForm.name,
        email: profileForm.email,
        position: profileForm.position,
        department: profileForm.department,
        phone: profileForm.phone,
        address: profileForm.address,
        city: profileForm.city,
        country: profileForm.country,
      };

      const data = await updateCurrentProfile(payload);
      const updatedUser = data.user || user;
      const employee = data.employee || {};

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setProfileForm((prev) => ({
        ...prev,
        name: updatedUser.name,
        email: updatedUser.email,
        position: employee.position || prev.position,
        department: employee.department || prev.department,
        phone: employee.phone || prev.phone,
        address: employee.address || prev.address,
        city: employee.city || prev.city,
        country: employee.country || prev.country,
        employeeId: employee._id ? `EMP${employee._id.toString().slice(-6).toUpperCase()}` : prev.employeeId,
        joinDate: employee.dateOfJoining ? new Date(employee.dateOfJoining).toISOString().split('T')[0] : prev.joinDate,
      }));

      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setProfileError(err?.response?.data?.error || "Failed to update profile. Please try again.");
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });

      setPasswordSuccess("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err) {
      console.error(err);
      setPasswordError(err?.response?.data?.error || "Password change failed. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!user) {
    return <div style={styles.loading}>{profileError || "No profile available."}</div>;
  }

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>My Profile</h1>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            style={styles.editButton}
          >
            <FaEdit /> Edit Profile
          </button>
        ) : (
          <div style={styles.editActions}>
            <button 
              onClick={handleSaveProfile}
              style={styles.saveButton}
            >
              <FaSave /> Save
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              style={styles.cancelButton}
            >
              <FaTimes /> Cancel
            </button>
          </div>
        )}
      </div>

      {/* Success / Error Messages */}
      {saveSuccess && (
        <div style={styles.successMessage}>
          <FaCheckCircle style={styles.successIcon} />
          Profile updated successfully!
        </div>
      )}
      {profileError && (
        <div style={styles.errorMessage}>
          {profileError}
        </div>
      )}

      {/* Profile Content */}
      <div style={styles.profileGrid}>
        {/* Left Column - Avatar & Basic Info */}
        <div style={styles.leftColumn}>
          <div style={styles.avatarCard}>
            <div style={styles.avatarContainer}>
              <div style={styles.avatar}>
                {profileForm.name.charAt(0)}
              </div>
              <button style={styles.cameraButton}>
                <FaCamera />
              </button>
            </div>
            <h2 style={styles.avatarName}>{profileForm.name}</h2>
            <p style={styles.avatarRole}>{profileForm.position}</p>
            <p style={styles.avatarId}>ID: {profileForm.employeeId}</p>
          </div>

          <div style={styles.passwordCard}>
            <h3 style={styles.cardTitle}>Security</h3>
            <button 
              onClick={() => setShowPasswordModal(true)}
              style={styles.passwordButton}
            >
              <FaKey /> Change Password
            </button>
          </div>
        </div>

        {/* Right Column - Profile Details */}
        <div style={styles.rightColumn}>
          {/* Personal Information */}
          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>Personal Information</h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <FaUser style={styles.infoIcon} />
                <div style={styles.infoContent}>
                  <span style={styles.infoLabel}>Full Name</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={profileForm.name}
                      onChange={handleInputChange}
                      style={styles.editInput}
                    />
                  ) : (
                    <span style={styles.infoValue}>{profileForm.name}</span>
                  )}
                </div>
              </div>

              <div style={styles.infoItem}>
                <FaEnvelope style={styles.infoIcon} />
                <div style={styles.infoContent}>
                  <span style={styles.infoLabel}>Email Address</span>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleInputChange}
                      style={styles.editInput}
                    />
                  ) : (
                    <span style={styles.infoValue}>{profileForm.email}</span>
                  )}
                </div>
              </div>

              <div style={styles.infoItem}>
                <FaPhone style={styles.infoIcon} />
                <div style={styles.infoContent}>
                  <span style={styles.infoLabel}>Phone Number</span>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleInputChange}
                      style={styles.editInput}
                    />
                  ) : (
                    <span style={styles.infoValue}>{profileForm.phone}</span>
                  )}
                </div>
              </div>

              <div style={styles.infoItem}>
                <FaMapMarkerAlt style={styles.infoIcon} />
                <div style={styles.infoContent}>
                  <span style={styles.infoLabel}>Address</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={profileForm.address}
                      onChange={handleInputChange}
                      style={styles.editInput}
                    />
                  ) : (
                    <span style={styles.infoValue}>{profileForm.address}</span>
                  )}
                </div>
              </div>

              <div style={styles.infoItem}>
                <FaBuilding style={styles.infoIcon} />
                <div style={styles.infoContent}>
                  <span style={styles.infoLabel}>City</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={profileForm.city}
                      onChange={handleInputChange}
                      style={styles.editInput}
                    />
                  ) : (
                    <span style={styles.infoValue}>{profileForm.city}</span>
                  )}
                </div>
              </div>

              <div style={styles.infoItem}>
                <FaMapMarkerAlt style={styles.infoIcon} />
                <div style={styles.infoContent}>
                  <span style={styles.infoLabel}>Country</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="country"
                      value={profileForm.country}
                      onChange={handleInputChange}
                      style={styles.editInput}
                    />
                  ) : (
                    <span style={styles.infoValue}>{profileForm.country}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>Employment Details</h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <FaBriefcase style={styles.infoIcon} />
                <div style={styles.infoContent}>
                  <span style={styles.infoLabel}>Department</span>
                  <span style={styles.infoValue}>{profileForm.department}</span>
                </div>
              </div>

              <div style={styles.infoItem}>
                <FaUser style={styles.infoIcon} />
                <div style={styles.infoContent}>
                  <span style={styles.infoLabel}>Position</span>
                  <span style={styles.infoValue}>{profileForm.position}</span>
                </div>
              </div>

              <div style={styles.infoItem}>
                <FaBuilding style={styles.infoIcon} />
                <div style={styles.infoContent}>
                  <span style={styles.infoLabel}>Employee ID</span>
                  <span style={styles.infoValue}>{profileForm.employeeId}</span>
                </div>
              </div>

              <div style={styles.infoItem}>
                <FaCalendarAlt style={styles.infoIcon} />
                <div style={styles.infoContent}>
                  <span style={styles.infoLabel}>Join Date</span>
                  <span style={styles.infoValue}>{formatDate(profileForm.joinDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Change Password</h3>
              <button 
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError("");
                  setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                  });
                }}
                style={styles.modalClose}
              >
                <FaTimes />
              </button>
            </div>

            <div style={styles.modalBody}>
              {passwordError && (
                <div style={styles.modalError}>{passwordError}</div>
              )}
            {passwordSuccess && (
                <div style={styles.modalSuccess}>{passwordSuccess}</div>
              )}

              <div style={styles.modalFormGroup}>
                <label style={styles.modalLabel}>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  style={styles.modalInput}
                  placeholder="Enter current password"
                />
              </div>

              <div style={styles.modalFormGroup}>
                <label style={styles.modalLabel}>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  style={styles.modalInput}
                  placeholder="Enter new password"
                />
              </div>

              <div style={styles.modalFormGroup}>
                <label style={styles.modalLabel}>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  style={styles.modalInput}
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button 
                onClick={handleChangePassword}
                style={styles.modalSaveButton}
              >
                Update Password
              </button>
              <button 
                onClick={() => setShowPasswordModal(false)}
                style={styles.modalCancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const styles = {
  pageContainer: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  loading: {
    textAlign: "center",
    padding: "50px",
    color: "#64748b",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  pageTitle: {
    fontSize: "28px",
    color: "#0f172a",
    margin: 0,
    fontWeight: "600",
  },
  editButton: {
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    boxShadow: "0 4px 6px rgba(59,130,246,0.3)",
  },
  editActions: {
    display: "flex",
    gap: "10px",
  },
  saveButton: {
    background: "#10b981",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },
  cancelButton: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },
  successMessage: {
    background: "#d1fae5",
    color: "#065f46",
    padding: "15px 20px",
    borderRadius: "10px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    fontWeight: "500",
  },
  errorMessage: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "15px 20px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "14px",
    fontWeight: "500",
  },
  successIcon: {
    fontSize: "18px",
  },
  profileGrid: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    gap: "25px",
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  avatarCard: {
    background: "white",
    borderRadius: "16px",
    padding: "30px",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  avatarContainer: {
    position: "relative",
    width: "120px",
    height: "120px",
    margin: "0 auto 20px",
  },
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "48px",
    fontWeight: "600",
    color: "white",
    margin: "0 auto",
  },
  cameraButton: {
    position: "absolute",
    bottom: "5px",
    right: "5px",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#3b82f6",
    border: "3px solid white",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "16px",
  },
  avatarName: {
    fontSize: "20px",
    color: "#0f172a",
    margin: "0 0 5px 0",
    fontWeight: "600",
  },
  avatarRole: {
    fontSize: "14px",
    color: "#64748b",
    margin: "0 0 5px 0",
  },
  avatarId: {
    fontSize: "12px",
    color: "#94a3b8",
    margin: 0,
  },
  passwordCard: {
    background: "white",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    fontSize: "16px",
    color: "#0f172a",
    margin: "0 0 15px 0",
    fontWeight: "600",
  },
  passwordButton: {
    width: "100%",
    padding: "12px",
    background: "#f1f5f9",
    border: "none",
    borderRadius: "10px",
    color: "#475569",
    fontSize: "14px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  infoCard: {
    background: "white",
    borderRadius: "16px",
    padding: "25px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },
  infoItem: {
    display: "flex",
    gap: "12px",
  },
  infoIcon: {
    fontSize: "18px",
    color: "#3b82f6",
    marginTop: "3px",
  },
  infoContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  infoLabel: {
    fontSize: "12px",
    color: "#64748b",
  },
  infoValue: {
    fontSize: "14px",
    color: "#0f172a",
    fontWeight: "500",
  },
  editInput: {
    padding: "8px",
    border: "2px solid #3b82f6",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    background: "white",
    borderRadius: "16px",
    width: "90%",
    maxWidth: "400px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  modalHeader: {
    padding: "20px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: "18px",
    color: "#0f172a",
    margin: 0,
    fontWeight: "600",
  },
  modalClose: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#64748b",
  },
  modalBody: {
    padding: "20px",
  },
  modalError: {
    background: "#fee2e2",
    color: "#ef4444",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "15px",
  },
  modalSuccess: {
    background: "#d1fae5",
    color: "#065f46",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "15px",
  },
  modalFormGroup: {
    marginBottom: "15px",
  },
  modalLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#475569",
    marginBottom: "5px",
  },
  modalInput: {
    width: "100%",
    padding: "12px",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  modalFooter: {
    padding: "20px",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
  },
  modalSaveButton: {
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  modalCancelButton: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
};

export default MyProfile;