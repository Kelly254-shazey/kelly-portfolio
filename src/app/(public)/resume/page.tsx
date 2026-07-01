import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/Button'
import { Download, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ResumePage() {
  const resume = await prisma.resume.findFirst({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Resume</p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Read the resume</h1>
            <p className="mt-2 max-w-2xl text-base text-slate-600 dark:text-slate-300">
              View the active resume directly on the site. If you want to download it, use the button below.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="inline-flex">
              <Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>
                Back to home
              </Button>
            </Link>
            {resume?.url ? (
              resume.downloadEnabled ? (
                <Link href="/api/resume/download" className="inline-flex">
                  <Button variant="primary" icon={<Download className="h-4 w-4" />}>
                    Download PDF
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" icon={<Download className="h-4 w-4" />} disabled>
                  Download Disabled
                </Button>
              )
            ) : null}
          </div>
        </div>

        <div className="grow rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          {!resume?.url ? (
            <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
              No active resume is available right now.
            </div>
          ) : (
            <iframe
              src={resume.url}
              title="Resume viewer"
              className="h-[calc(100vh-220px)] w-full rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          )}
        </div>
      </div>
    </div>
  )
}
