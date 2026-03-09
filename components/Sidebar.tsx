import React from 'react';
import { Slider } from './ui/Slider';

export interface Drivers {
  dailyLoad: number;
  batteryAutonomy: number;
  hydrogenAutonomy: number;
}

export interface DerivedValues {
  thermalBaseload: number;
  solarCapacity: number;
  solarPerformance: number;
  batteryCapacity: number;
  batteryPower: number;
  batteryReserve: number;
  electrolyzerPower: number;
  electrolyzerEnergy: number;
  electrolyzerHeatRecovery: number;
  storageCapacity: number;
  storagePower: number;
  fuelCellEfficiency: number;
  generatorCapacity: number;
  gridLimit: number;
}

interface SidebarProps {
  drivers: Drivers;
  derived: DerivedValues;
  onDriversChange: (drivers: Drivers) => void;
}

export function Sidebar({ drivers, derived, onDriversChange }: SidebarProps) {
  const updateDriver = (key: keyof Drivers, val: number) => {
    onDriversChange({ ...drivers, [key]: val });
  };

  return (
    <aside className="w-64 p-4 bg-gray-800 h-screen overflow-auto text-white">
      <h2 className="text-lg font-semibold mb-4">Project Inputs</h2>

      {/* Project Load & Autonomy */}
      <section className="mb-6">
        <h3 className="font-semibold">Project Load & Autonomy</h3>
        <Slider
          label="Daily Load (kW)"
          min={0}
          max={10000}
          value={drivers.dailyLoad}
          onChange={(v) => updateDriver('dailyLoad', v)}
          tooltip="Average electrical load per day in kilowatts."
        />
        <Slider
          label="Battery Autonomy (h)"
          min={0}
          max={24}
          value={drivers.batteryAutonomy}
          onChange={(v) => updateDriver('batteryAutonomy', v)}
          tooltip="Hours the battery must sustain the load without recharge."
        />
        <Slider
          label="Hydrogen Autonomy (h)"
          min={0}
          max={24}
          value={drivers.hydrogenAutonomy}
          onChange={(v) => updateDriver('hydrogenAutonomy', v)}
          tooltip="Hours the hydrogen storage must sustain the load."
        />
      </section>

      {/* Efficiencies & Constants (derived read‑only) */}
      <section className="mb-6">
        <h3 className="font-semibold">Efficiencies & Constants</h3>
        <Slider
          label="Solar PR (%)"
          min={0}
          max={100}
          value={derived.solarPerformance}
          onChange={() => {}}
          disabled
          tooltip="Performance ratio of the solar PV array (derived)."
        />
        <Slider
          label="Battery Reserve SOC (%)"
          min={0}
          max={100}
          value={derived.batteryReserve}
          onChange={() => {}}
          disabled
          tooltip="State of charge reserve for the battery (derived)."
        />
        <Slider
          label="Heat Recovery (%)"
          min={0}
          max={100}
          value={derived.electrolyzerHeatRecovery}
          onChange={() => {}}
          disabled
          tooltip="Portion of electrolyzer heat that is recovered (derived)."
        />
        <Slider
          label="FC Efficiency (%)"
          min={0}
          max={100}
          value={derived.fuelCellEfficiency}
          onChange={() => {}}
          disabled
          tooltip="Fuel cell efficiency (derived)."
        />
      </section>

      {/* Sizing Safety Factors */}
      <section className="mb-6">
        <h3 className="font-semibold">Sizing Safety Factors</h3>
        <Slider
          label="Battery Power (kW)"
          min={0}
          max={500}
          value={derived.batteryPower}
          onChange={() => {}}
          disabled
          tooltip="Installed battery power rating (derived)."
        />
        <Slider
          label="Storage Power (kW)"
          min={0}
          max={500}
          value={derived.storagePower}
          onChange={() => {}}
          disabled
          tooltip="Hydrogen storage power rating (derived)."
        />
        <Slider
          label="Generator Capacity (kW)"
          min={0}
          max={1000}
          value={derived.generatorCapacity}
          onChange={() => {}}
          disabled
          tooltip="Diesel generator capacity (derived)."
        />
        <Slider
          label="Grid Import Limit (kW)"
          min={0}
          max={1000}
          value={derived.gridLimit}
          onChange={() => {}}
          disabled
          tooltip="Maximum import from grid (derived)."
        />
      </section>

      {/* Financial Assumptions */}
      <section className="mb-6">
        <h3 className="font-semibold">Financial Assumptions</h3>
        <p className="text-xs text-gray-400">All financial parameters are computed automatically.</p>
      </section>

      {/* Cost Parameters */}
      <section className="mb-6">
        <h3 className="font-semibold">Cost Parameters</h3>
        <p className="text-xs text-gray-400">Cost figures derived from backend response.</p>
      </section>
    </aside>
  );
}
