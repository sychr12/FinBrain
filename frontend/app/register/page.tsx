"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, CheckCircle2, Eye, EyeOff, ShieldCheck, XCircle } from "lucide-react";
import { register } from "@/services/api";
import { ImageAIResult, ImageAIStatus, validateHumanProfileImage } from "@/services/profileImageAI";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [imageStatus, setImageStatus] = useState<ImageAIStatus>("idle");
  const [imageResult, setImageResult] = useState<ImageAIResult | null>(null);

  const strength = useMemo(() => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  }, [form.password]);

  const strengthLabel = ["", "Fraca", "Fraca", "Media", "Boa", "Forte"][strength];
  const photoApproved = imageStatus === "approved" && imageResult?.approved;

  function validar() {
    if (!form.nome || !form.email || !form.password || !form.confirmPassword) {
      return "Preencha todos os campos";
    }
    if (!form.email.includes("@")) return "Email invalido";
    if (form.password.length < 6) return "Senha deve ter pelo menos 6 caracteres";
    if (form.password !== form.confirmPassword) return "Senhas nao coincidem";
    if (!photoApproved) return "Envie uma foto real e aguarde a validacao por IA";
    return null;
  }

  async function handleImage(file?: File) {
    setErro("");
    setImageResult(null);

    if (!file) {
      setImageStatus("idle");
      return;
    }

    setImageStatus("checking");
    const result = await validateHumanProfileImage(file);
    setImageResult(result);
    setImageStatus(result.approved ? "approved" : "blocked");

    if (!result.approved) {
      setErro(result.reason);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    const erroValidacao = validar();
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    try {
      setLoading(true);
      await register({
        nome: form.nome.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      if (imageResult?.dataUrl) {
        localStorage.setItem(
          `pending-profile-photo:${form.email.trim().toLowerCase()}`,
          JSON.stringify({
            fotoPerfil: imageResult.dataUrl,
            fotoValidada: true,
            reconhecimentoFacial: imageResult.recognitionSummary,
          })
        );
      }

      router.push(`/confirmar?email=${encodeURIComponent(form.email.trim())}`);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Nao foi possivel criar a conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F5F7] text-[#303030]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden bg-[#4F2EC0] px-10 py-8 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
              <Image src="/logosg/sacodecompra.png" alt="FinBrain" width={26} height={26} />
            </div>
            <strong className="font-sans text-lg">FinBrain</strong>
          </div>

          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <div className="mb-8 flex h-64 w-64 items-center justify-center rounded-full border border-white/20 bg-white/10">
              <Image src="/perfilregistro/perfilrg.png" alt="Cadastro seguro" width={190} height={190} />
            </div>
            <h1 className="text-3xl font-bold">Cadastro com verificacao facial</h1>
            <p className="mt-3 text-sm leading-6 text-white/75">
              A IA aceita apenas foto humana real, bloqueia desenho, anime e avatar, e depois gera o reconhecimento facial local.
            </p>
          </div>

          <div className="text-sm text-white/70">Seguranca de perfil ativada</div>
        </section>

        <section className="flex items-center justify-center px-5 py-8">
          <form onSubmit={handleSubmit} className="w-full max-w-190 rounded-2xl border border-[#E8E6F5] bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Criar conta</h2>
              <p className="mt-1 text-sm text-[#6B6B7A]">Preencha seus dados e envie uma foto real para liberar o cadastro.</p>
            </div>

            {erro && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {erro}
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase text-[#6B6B7A]">Nome completo</span>
                  <input
                    className="h-12 w-full rounded-xl border border-[#E0E0E0] bg-[#F8F7FF] px-4 text-sm outline-none transition focus:border-[#4F2EC0] focus:bg-white"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    placeholder="Seu nome completo"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase text-[#6B6B7A]">E-mail</span>
                  <input
                    type="email"
                    className="h-12 w-full rounded-xl border border-[#E0E0E0] bg-[#F8F7FF] px-4 text-sm outline-none transition focus:border-[#4F2EC0] focus:bg-white"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="seu@email.com"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase text-[#6B6B7A]">Senha</span>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      className="h-12 w-full rounded-xl border border-[#E0E0E0] bg-[#F8F7FF] px-4 pr-12 text-sm outline-none transition focus:border-[#4F2EC0] focus:bg-white"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Minimo 6 caracteres"
                    />
                    <button
                      type="button"
                      aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#6B6B7A] hover:bg-[#EDE8FF] hover:text-[#4F2EC0]"
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {form.password && (
                    <div className="mt-2">
                      <div className="grid grid-cols-5 gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span
                            key={i}
                            className={`h-1 rounded-full ${i <= strength ? "bg-[#4F2EC0]" : "bg-[#E0E0E0]"}`}
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-right text-xs text-[#6B6B7A]">Forca: {strengthLabel}</p>
                    </div>
                  )}
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase text-[#6B6B7A]">Confirmar senha</span>
                  <input
                    type="password"
                    className="h-12 w-full rounded-xl border border-[#E0E0E0] bg-[#F8F7FF] px-4 text-sm outline-none transition focus:border-[#4F2EC0] focus:bg-white"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Repita a senha"
                  />
                </label>
              </div>

              <div className="rounded-2xl border border-[#E8E6F5] bg-[#FBFAFF] p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#303030]">
                  <ShieldCheck size={18} color="#4F2EC0" />
                  Validacao por IA
                </div>

                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#BEB5EA] bg-white text-center transition hover:border-[#4F2EC0]">
                  {imageResult?.dataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageResult.dataUrl} alt="Foto validada" className="h-full w-full object-cover" />
                  ) : (
                    <div className="px-5">
                      <Camera className="mx-auto mb-3 text-[#4F2EC0]" size={34} />
                      <span className="block text-sm font-semibold">Enviar foto</span>
                      <span className="mt-1 block text-xs text-[#6B6B7A]">Apenas foto humana real</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => handleImage(e.target.files?.[0])}
                  />
                </label>

                <div className="mt-4 rounded-xl bg-white p-3 text-sm">
                  {imageStatus === "idle" && <p className="text-[#6B6B7A]">Aguardando foto para analise.</p>}
                  {imageStatus === "checking" && <p className="text-[#4F2EC0]">IA analisando foto real e rosto...</p>}
                  {imageStatus === "approved" && (
                    <p className="flex gap-2 text-green-700">
                      <CheckCircle2 className="mt-0.5 shrink-0" size={16} />
                      {imageResult?.recognitionSummary}
                    </p>
                  )}
                  {imageStatus === "blocked" && (
                    <p className="flex gap-2 text-red-700">
                      <XCircle className="mt-0.5 shrink-0" size={16} />
                      {imageResult?.reason}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !photoApproved}
              className="mt-6 h-12 w-full rounded-xl bg-[#4F2EC0] text-sm font-bold text-white transition hover:bg-[#3F25A4] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </button>

            <p className="mt-5 text-center text-sm text-[#6B6B7A]">
              Ja tem conta?{" "}
              <button type="button" className="font-bold text-[#4F2EC0]" onClick={() => router.push("/login")}>
                Fazer login
              </button>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
