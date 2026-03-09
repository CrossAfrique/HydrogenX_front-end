"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, Drivers, DerivedValues } from '../components/Sidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface Preview {
  lcoe: number;
  lcoh: number;
  capex: number;
  revenue: number;
}

export default function HomePage() {
  const router = useRouter();

  const [drivers, setDrivers] = useState<Drivers>({
    dailyLoad: 500,
    batteryAutonomy: 2,
    hydrogenAutonomy: 4
  });
  const [derived, setDerived] = useState<DerivedValues>(computeDerived(drivers));
  const [preview, setPreview] = useState<Preview | null>(null);
  const [calcResult, setCalcResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // recompute derived values and call backend when drivers change
  useEffect(() => {
    const newDerived = computeDerived(drivers);
    setDerived(newDerived);

    const doCalc = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://hydrogenx.onrender.com/calculate_single_site', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parameters: { ...drivers, ...newDerived } })
        });
        const data = await response.json();
        setCalcResult(data);
        // backend should return lcoe, lcoh, capex, revenue etc.
        setPreview({
          lcoe: data.lcoe ?? 0,
          lcoh: data.lcoh ?? 0,
          capex: data.capex ?? 0,
          revenue: data.revenue ?? data.totalRevenue ?? 0
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    doCalc();
  }, [drivers]);

  const goDashboard = () => {
    if (calcResult) {
      router.push({
        pathname: '/dashboard',
        query: { data: JSON.stringify(calcResult) }
      });
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar drivers={drivers} derived={derived} onDriversChange={setDrivers} />
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">HydrogenX Inputs</h1>
          <Button onClick={goDashboard} disabled={!preview || loading}>
            View Dashboard
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card title="LCOE" value={preview?.lcoe ?? '—'} />
          <Card title="LCOH" value={preview?.lcoh ?? '—'} />
          <Card title="CAPEX" value={preview?.capex ?? '—'} />
          <Card title="Revenue" value={preview?.revenue ?? '—'} />
        </div>
        {loading && <p className="text-sm text-gray-400">Calculating…</p>}
      </main>
    </div>
  );
}

function computeDerived(d: Drivers): DerivedValues {
  // simplistic derivation rules for demonstration
  return {
    thermalBaseload: d.dailyLoad,
    solarCapacity: d.dailyLoad * 0.4,
    solarPerformance: 50,
    batteryCapacity: d.dailyLoad * d.batteryAutonomy,
    batteryPower: d.dailyLoad * 0.2,
    batteryReserve: 20,
    electrolyzerPower: d.dailyLoad * 0.6,
    electrolyzerEnergy: 50,
    electrolyzerHeatRecovery: 20,
    storageCapacity: d.dailyLoad * d.hydrogenAutonomy,
    storagePower: d.dailyLoad * 0.3,
    fuelCellEfficiency: 60,
    generatorCapacity: d.dailyLoad * 0.8,
    gridLimit: d.dailyLoad * 0.5
  };
}
