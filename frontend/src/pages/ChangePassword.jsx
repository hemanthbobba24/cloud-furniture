import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import api from "../lib/api";

export default function ChangePassword() {
    const nav = useNavigate();
    const { logout} = useAuth();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [busy, setBusy] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        setSuccess(false);
        setLoading(true);
        setBusy(true);

        try {
            await api.post("auth/change-password", { currentPassword, newPassword, confirmPassword });
            setSuccess(true);
            logout();
            // Clear cart on logout
            localStorage.removeItem("cart");
           // setCartCount(0);
            //if (loc.pathname !== "/browse") navigate("/browse");
            nav("/logout");
        } catch (ex) {
            setErr(ex?.response?.data?.message || ex?.message || "Invalid password");
            setBusy(false);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: "100%",
        padding: 10,
        borderRadius: 6,
        border: "1px solid #d1d5db",
        fontSize: 14,
        paddingRight: "40px", // space for eye icon
    };

    const eyeStyle = {
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
    };

    return (
        <div style={{ maxWidth: 520, margin: "40px auto", padding: "0 16px" }}>
            <h1>Change Password</h1>
            {err && (
                <div style={{ color: "#b00020", marginBottom: 10, padding: 10, background: "#fee", borderRadius: 6 }}>
                    {err}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Current Password */}
                <div style={{ position: "relative", marginBottom: 16 }}>
                    <label>Current Password</label>
                    <input
                        type={showCurrent ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => { setCurrentPassword(e.target.value); setErr(""); }}
                        required
                        disabled={busy || success}
                        style={inputStyle}
                    />
                    <span style={eyeStyle} onClick={() => setShowCurrent(!showCurrent)}>
                        {showCurrent ? "\u{1F441}" : "\u{1F441}\u{200D}\u{1F5E8}"}
                    </span>
                </div>

                {/* New Password */}
                <div style={{ position: "relative", marginBottom: 16 }}>
                    <label>New Password</label>
                    <input
                        type={showNew ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        required
                        minLength="8"
                        disabled={busy || success}
                        style={inputStyle}
                    />
                    <span style={eyeStyle} onClick={() => setShowNew(!showNew)}>
                        {showNew ? "\u{1F441}" : "\u{1F441}\u{200D}\u{1F5E8}"}
                    </span>
                </div>

                {/* Confirm Password */}
                <div style={{ position: "relative", marginBottom: 16 }}>
                    <label>Confirm Password</label>
                    <input
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        required
                        minLength="8"
                        disabled={busy || success}
                        style={{
                            ...inputStyle,
                            border: confirmPassword && newPassword !== confirmPassword ? "1px solid #b00020" : "1px solid #d1d5db",
                        }}
                    />
                    <span style={eyeStyle} onClick={() => setShowConfirm(!showConfirm)}>
                        {showConfirm ? "\u{1F441}" : "\u{1F441}\u{200D}\u{1F5E8}"}
                    </span>
                    {confirmPassword && newPassword !== confirmPassword && (
                        <div style={{ color: "#b00020", fontSize: 12, marginTop: 4 }}>Passwords do not match</div>
                    )}
                </div>

                <button disabled={loading} type="submit" style={{ width: "100%", padding: 10, cursor: loading ? "not-allowed" : "pointer" }}>
                    {loading ? "Changing Password..." : "Change Password"}
                </button>
            </form>
        </div>
    );
}
