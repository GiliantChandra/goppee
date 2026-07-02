import './App.css'

const features = [
  {
    title: 'Cepat & Modern',
    description: 'Dibangun dengan React, TypeScript, dan Vite untuk performa yang ringan dan pengalaman yang cepat.',
  },
  {
    title: 'Tampilan yang Menarik',
    description: 'Desain landing page yang bersih, responsif, dan siap dipakai untuk bisnis, portofolio, atau startup.',
  },
  {
    title: 'Mudah Dikustomisasi',
    description: 'Struktur sederhana sehingga Anda bisa mengubah teks, warna, dan konten dengan cepat.',
  },
]

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <div className="text-xl font-semibold tracking-tight">Goppee</div>
        <nav className="hidden gap-6 text-sm text-slate-300 md:flex">
          <a href="#features" className="transition hover:text-white">Fitur</a>
          <a href="#about" className="transition hover:text-white">Tentang</a>
          <a href="#contact" className="transition hover:text-white">Kontak</a>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-300">
              Template website modern
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Bangun identitas digital Anda dengan desain yang siap pakai.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Template ini hadir dengan pendekatan yang simpel, elegan, dan cepat untuk memulai website bisnis, portofolio, atau landing page produk.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contact"
                className="rounded-full bg-cyan-400 px-6 py-3 text-center font-medium text-slate-950 transition hover:bg-cyan-300"
              >
                Mulai Sekarang
              </a>
              <a
                href="#features"
                className="rounded-full border border-slate-700 px-6 py-3 text-center font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
              >
                Lihat Fitur
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/30">
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-800 to-slate-950 p-6">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="mt-6 space-y-4">
                <div className="h-3 w-32 rounded-full bg-slate-700" />
                <div className="h-3 w-24 rounded-full bg-slate-700" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="h-24 rounded-2xl bg-cyan-500/20" />
                  <div className="h-24 rounded-2xl bg-slate-800" />
                </div>
                <div className="h-3 w-40 rounded-full bg-slate-700" />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Fitur</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Semua yang Anda butuhkan untuk memulai</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 p-8 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Tentang</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Siap membantu Anda tampil lebih percaya diri online.</h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              Template ini dibuat untuk Anda yang ingin memulai cepat tanpa mengorbankan kualitas visual. Cocok untuk presentasi produk, portofolio, atau profil perusahaan.
            </p>
          </div>
        </section>
      </main>

      <footer id="contact" className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-slate-800 px-6 py-8 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>© 2026 Goppee. Semua hak dilindungi.</p>
        <a href="mailto:hello@goppee.com" className="text-cyan-300 transition hover:text-cyan-200">
          hello@goppee.com
        </a>
      </footer>
    </div>
  )
}

export default App
