"use client";

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card } from '../../components/ui/Card';
import { MonthlyChart } from '../../components/MonthlyChart';
import { Button } from '../../components/ui/Button';

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const dataStr = searchParams.get('data');
  let result: any = null;
  try {
    if (dataStr) {
      result = JSON.parse(decodeURIComponent(dataStr));
    }
  } catch (e) {
    console.error('failed to parse dashboard data', e);
  }

  if (!result) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-400">No data available. Please run a calculation on the home page.</p>
        <Button className="ml-4" onClick={() => router.push('/')}>Home</Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <aside className="w-64 bg-gray-800 p-6 overflow-auto">
        <h2 className="text-xl font-bold mb-4">Detailed Breakdown</h2>
        <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card title="Electricity" value={result.electricityRevenue ?? '—'} />
          <Card title="Heat" value={result.heatRevenue ?? '—'} />
          <Card title="Oxygen" value={result.oxygenRevenue ?? '—'} />
          <Card title="Total" value={result.totalRevenue ?? '—'} />
        </div>
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Monthly Revenue & Cost</h2>
          <MonthlyChart data={result.monthly ?? []} />
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
