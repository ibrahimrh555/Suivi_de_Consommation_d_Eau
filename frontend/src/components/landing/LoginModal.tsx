import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff, LockKeyhole, UserRound, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (numPolice: string, password: string) => Promise<void>;
};

export function LoginModal({ open, onClose, onSubmit }: Props) {
  const [numPolice, setNumPolice] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", close);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await onSubmit(numPolice, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-[#14183e]/65 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="login-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form onSubmit={submit} className="relative w-full max-w-md rounded-[28px] bg-white p-8 shadow-2xl">
        <button type="button" onClick={onClose} className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-[#f4f7fb]" aria-label="Fermer"><X className="h-5 w-5" /></button>
        <img src="/figma-assets/aquawatch-logo.png" alt="AquaWatch" className="h-[58px] w-[175px] object-contain" />
        <h2 id="login-title" className="mt-6 text-3xl font-bold">Connexion</h2>
        <p className="mt-2 text-sm text-[#5e6282]">Accédez à votre tableau de bord AquaWatch.</p>
        <label className="mt-7 block"><span className="mb-2 block text-sm font-semibold">Numéro de police</span><span className="flex h-12 items-center gap-3 rounded-xl border border-[#dde3ed] px-4 focus-within:border-[#0869f7]"><UserRound className="h-5 w-5 text-[#8b94a5]" /><input value={numPolice} onChange={(event) => setNumPolice(event.target.value)} required inputMode="numeric" className="w-full bg-transparent text-sm outline-none" placeholder="Votre numéro" /></span></label>
        <label className="mt-5 block"><span className="mb-2 block text-sm font-semibold">Mot de passe</span><span className="flex h-12 items-center gap-3 rounded-xl border border-[#dde3ed] px-4 focus-within:border-[#0869f7]"><LockKeyhole className="h-5 w-5 text-[#8b94a5]" /><input value={password} onChange={(event) => setPassword(event.target.value)} required type={showPassword ? "text" : "password"} className="w-full bg-transparent text-sm outline-none" placeholder="Votre mot de passe" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Masquer" : "Afficher"}>{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></span></label>
        <button disabled={loading} className="mt-7 h-12 w-full rounded-xl bg-[#0869f7] text-sm font-semibold text-white transition hover:bg-[#075bd5] disabled:opacity-60">{loading ? "Connexion…" : "Se connecter"}</button>
      </form>
    </div>
  );
}
