'use client'; // This tells Next.js this is a client-side component

export default function RegisterPage() {
  return (
    <div className="auth-card">
      <h2>Create Account</h2>
      {/* This now points to your new API Route */}
      <form action="/api/auth/register" method="POST">
        <div className="form-group">
          <select name="role" required>
            <option value="student">Student</option>
          </select>
        </div>
        <div className="form-group">
          <input type="text" name="full_name" placeholder="Full Name" required />
        </div>
        <div className="form-group">
          <input type="email" name="email" placeholder="Email Address" required />
        </div>
        <div className="form-group">
          <input type="password" name="password" placeholder="Password" required />
        </div>
        <div className="form-group">
          <input type="text" name="reg_number" placeholder="Registration Number" required />
        </div>
        <button type="submit">Complete Registration</button>
      </form>
    </div>
  );
}
