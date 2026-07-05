'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Sparkles, AlertCircle } from 'lucide-react';
import { adminLogin } from '@/lib/admin-auth';
import { ease, dur } from '@/lib/motion';

const AdminLoginPage: React.FC = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autofillBlocked, setAutofillBlocked] = useState(true);

  useEffect(() => {
    setPassword('');
    setShowPassword(false);
    setError('');
    setAutofillBlocked(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsLoading(true);
    setError('');

    const result = await adminLogin(password);
    if (result.ok) {
      setPassword('');
      router.replace('/admin');
      router.refresh();
    } else {
      setError(result.error || 'Incorrect password. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-canvas)' }}
    >
      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="orb absolute w-[600px] h-[600px]"
          style={{
            background: 'radial-gradient(circle, var(--orb-violet) 0%, transparent 65%)',
            top: '-10%', left: '-10%',
            filter: 'blur(90px)',
            animation: 'atmosphericFloat 18s ease-in-out infinite',
          }}
        />
        <div
          className="orb absolute w-[500px] h-[500px]"
          style={{
            background: 'radial-gradient(circle, var(--orb-rose) 0%, transparent 65%)',
            bottom: '-10%', right: '-10%',
            filter: 'blur(90px)',
            animation: 'atmosphericFloat 22s ease-in-out infinite reverse',
          }}
        />
        <div
          className="orb absolute w-[400px] h-[400px]"
          style={{
            background: 'radial-gradient(circle, var(--orb-sage) 0%, transparent 65%)',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(100px)',
            animation: 'atmosphericFloat 14s ease-in-out infinite',
          }}
        />
      </div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: dur.slow, ease: ease.out }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div
          className="glass-card rounded-3xl p-10"
          style={{ background: 'var(--glass-2)' }}
        >
          {/* Logo mark */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
            className="flex flex-col items-center mb-8"
          >
            <div className="relative mb-4">
              {/* Glow ring */}
              <div
                className="absolute inset-0 rounded-[20px]"
                style={{
                  background: 'var(--gradient-primary)',
                  filter: 'blur(16px)',
                  opacity: 0.4,
                  transform: 'scale(1.4)',
                  animation: 'glowPulse 4s ease-in-out infinite',
                }}
              />
              <div
                className="relative w-16 h-16 rounded-[20px] flex items-center justify-center"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <Lock size={22} className="text-white" />
              </div>
            </div>
            <h1
              className="font-display font-bold text-2xl tracking-tight"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}
            >
              Admin Access
            </h1>
            <p className="font-sans text-sm mt-1.5" style={{ color: 'var(--text-muted)' }}>
              BinaryScouts Studio Dashboard
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur.base, ease: ease.out, delay: 0.25 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            autoComplete="off"
          >
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="admin-access-key"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                onFocus={() => setAutofillBlocked(false)}
                readOnly={autofillBlocked}
                placeholder="Enter admin password"
                className="input-cinematic pr-12"
                autoComplete="new-password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                style={{
                  background: 'rgba(239,68,68,0.10)',
                  border: '1px solid rgba(239,68,68,0.20)',
                  color: '#EF4444',
                }}
              >
                <AlertCircle size={14} />
                <span className="font-sans text-sm">{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="btn-primary justify-center gap-2 py-4 shimmer-sweep"
              style={{ opacity: isLoading || !password ? 0.6 : 1 }}
            >
              {isLoading ? (
                <>
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                  />
                  Verifying...
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  Access Dashboard
                </>
              )}
            </button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center font-sans text-xs mt-6"
            style={{ color: 'var(--text-muted)' }}
          >
            This is a protected area. Unauthorized access is not permitted.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
